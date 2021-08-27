import Comment, { CommentDocument, CommentType } from "@models/Comment";
import Post from "@models/Post";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { DeleteResponse, PaginatedResult, Response } from "utils/types";

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

  switch (method) {
    case "DELETE": {
      const { postId }: { postId: string } = req.body;
      const session = await authorize(req, res);
      try {
        const postToDelete: Array<CommentType> = await Post.aggregate([
          { $match: { _id: { $eq: Types.ObjectId(postId) } } },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          { $unwind: "$owner" },
        ]);

        if (
          postToDelete[0].owner._id?.toString() !==
          session?.user?._id?.toString()
        ) {
          return res.status(400).json({
            success: false,
            data: null,
            errors: { delete: "You are not the owner of the post." },
          });
        }

        await Post.deleteOne({ _id: { $eq: Types.ObjectId(postId) } });

        await Comment.deleteMany({ postId: { $eq: postId } });

        return res.status(200).json({
          success: true,
          data: { ok: 1, deleteId: postId },
          errors: {},
        });
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
