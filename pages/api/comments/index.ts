import { commentPipeline } from "@api/aggregation";
import Comment, { CommentDocument, CommentType } from "@models/Comment";
import Post from "@models/Post";
import User from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { createSchema } from "schemaValidators/comment";
import dbConnect from "utils/dbConnect";
import { authorize, formatYupErrors } from "utils/fns";
import { DeleteResponse, PaginatedResult, Response } from "utils/types";
import { ValidationError } from "yup";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    Response<
      | DeleteResponse
      | CommentDocument
      | CommentDocument[]
      | null
      | PaginatedResult<CommentType | null>
    >
  >
) => {
  await dbConnect();

  const { method } = req;

  const session = await getSession({ req });

  switch (method) {
    case "GET": {
      try {
        const { limit, after, postId, threadId } = req.query;

        const comments: Array<CommentType> = await Comment.aggregate([
          {
            $match: {
              postId: { $eq: postId },
              $expr: {
                $and: [
                  {
                    $cond: {
                      if: { $eq: [threadId, ""] },
                      then: {
                        $eq: ["$inReplyToCommentId", ""],
                      },
                      else: {
                        $eq: [{ $toString: "$_id" }, threadId],
                      },
                    },
                  },
                  {
                    $cond: {
                      if: { $ne: [after, ""] },
                      then: {
                        $lt: ["$_id", Types.ObjectId(after as string)],
                      },
                      else: {},
                    },
                  },
                ],
              },
            },
          },
          ...commentPipeline(session!),
          { $sort: { createdAt: -1 } },
          { $limit: Number(limit) },
        ]);

        const hasNextPage =
          comments.length && comments[comments.length - 1] !== undefined
            ? !!(await Comment.findOne({
                postId: { $eq: postId as string },
                inReplyToCommentId: { $eq: "" },
                _id: { $lt: Types.ObjectId(comments[comments.length - 1]._id) },
              }))
            : false;

        return res.status(200).json({
          success: true,
          data: {
            pages: comments,
            pageInfo: {
              hasNextPage,
              startCursor: comments.length ? comments[0]._id! : "",
              endCursor: comments.length
                ? comments[comments.length - 1]._id!
                : "",
            },
          },
          errors: {},
        });
      } catch (error) {
        console.log(error);
      }
    }
    case "POST": {
      try {
        const {
          inReplyToCommentId,
          inReplyToUsername,
          text,
          postId,
          prevDepth,
        } = req.body;

        const session = await authorize(req, res);

        const owner = await User.findById(Types.ObjectId(session?.user?._id!));

        const post = await Post.findById(postId);

        if (!post) {
          return res
            .status(400)
            .json({ success: false, errors: {}, data: null });
        }

        await createSchema.validate({ text }, { abortEarly: false });

        const comment = await Comment.create({
          owner,
          postId: post?._id,
          inReplyToCommentId,
          inReplyToUsername,
          text,
          replies: {},
          isTombstone: false,
        });

        await Post.findOneAndUpdate(
          { _id: { $eq: post?._id } },
          { $push: { comments: comment } }
        );

        if (inReplyToCommentId) {
          await Comment.findOneAndUpdate(
            {
              _id: { $eq: inReplyToCommentId },
            },
            { $push: { children: comment._id } },
            { new: true }
          );
        }

        const data: Array<CommentDocument> = await Comment.aggregate([
          { $match: { _id: { $eq: comment?._id } } },

          {
            $lookup: {
              from: "users",
              let: { owner: "$owner" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
                { $project: { password: 0 } },
              ],
              as: "owner",
            },
          },
          { $unwind: "$owner" },
          {
            $addFields: {
              depth: prevDepth + 1,
              hasChildren: { $size: "$children" },
              likesCount: { $size: "$likes" },
            },
          },
        ]);

        return res
          .status(200)
          .json({ success: true, data: data[0], errors: {} });
      } catch (error) {
        console.log(error);
        const errors = formatYupErrors(error as ValidationError);
        return res.status(400).json({ success: false, errors, data: null });
      }
    }
    case "DELETE": {
      const { commentId }: { commentId: string } = req.body;
      const session = await authorize(req, res);
      try {
        const commentToDelete: Array<CommentType> = await Comment.aggregate([
          { $match: { _id: { $eq: Types.ObjectId(commentId) } } },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          { $unwind: "$owner" },
          { $addFields: { hasChildren: { $size: "$children" } } },
        ]);

        if (
          commentToDelete[0].owner._id?.toString() !==
          session?.user?._id?.toString()
        ) {
          return res.status(400).json({
            success: false,
            data: null,
            errors: { delete: "You are not the owner of the comment." },
          });
        }
        console.log(commentToDelete[0].hasChildren);
        if (Boolean(commentToDelete[0].hasChildren)) {
          await Comment.findOneAndUpdate(
            { _id: { $eq: Types.ObjectId(commentId) } },
            { $set: { isTombstone: true } },
            { new: true }
          );

          const updatedData = await Comment.aggregate([
            { $match: { _id: { $eq: Types.ObjectId(commentId) } } },
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
              },
            },
            { $unwind: "$owner" },
            {
              $addFields: {
                text: "[Deleted]",
                owner: {
                  username: "[Deleted]",
                  image:
                    "https://res.cloudinary.com/chimson/image/upload/h_150,w_150,g_center/v1629360713/tombstone.png",
                },
              },
            },
            { $project: { "owner.password": 0 } },
          ]);

          return res.status(200).json({
            success: true,
            data: updatedData[0],
            errors: {},
          });
        } else {
          await Comment.deleteOne({ _id: { $eq: Types.ObjectId(commentId) } });
          if (commentToDelete[0].inReplyToCommentId) {
            await Comment.updateOne(
              {
                _id: { $eq: commentToDelete[0].inReplyToCommentId },
              },
              { $pull: { children: { $in: [commentToDelete[0]._id] } } },
              { new: true }
            );
          }

          return res.status(200).json({
            success: true,
            data: { deleteId: commentId, ok: 1 },
            errors: {},
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          data: null,
          errors: { error: error as string },
        });
      }
    }
  }
};
