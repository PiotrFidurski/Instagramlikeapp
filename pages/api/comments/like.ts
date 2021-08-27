import Comment, { CommentType } from "@models/Comment";
import User from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next-auth/internals/utils";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<CommentType | null>>
) => {
  await dbConnect();

  const session = await authorize(req, res);

  const { commentId }: { commentId: string } = req.body;

  try {
    const commentToLike: Array<CommentType> = await Comment.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(commentId) } } },
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
          isLiked: session
            ? {
                $cond: {
                  if: {
                    $in: [
                      session ? Types.ObjectId(session?.user!._id) : "",
                      "$likes",
                    ],
                  },
                  then: true,
                  else: false,
                },
              }
            : null,
          hasChildren: { $size: "$children" },
          likesCount: { $size: "$likes" },
        },
      },
    ]);

    if (!commentToLike[0]) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: { like: "Can't find specified comment to like." },
      });
    }

    const user = await User.findOne({
      _id: { $eq: Types.ObjectId(session?.user?._id) },
    });

    if (commentToLike[0].isLiked) {
      await Comment.updateOne(
        { _id: { $eq: Types.ObjectId(commentId) } },
        { $pull: { likes: { $in: [user!] } } },
        { new: true }
      );
    } else {
      await Comment.updateOne(
        {
          _id: { $eq: Types.ObjectId(commentId) },
        },
        { $push: { likes: user! } },
        { new: true }
      );
    }

    const updatedData = await Comment.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(commentId) } } },
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
          isLiked: session
            ? {
                $cond: {
                  if: {
                    $in: [
                      session ? Types.ObjectId(session?.user!._id) : "",
                      "$likes",
                    ],
                  },
                  then: true,
                  else: false,
                },
              }
            : null,
          hasChildren: { $size: "$children" },
          likesCount: { $size: "$likes" },
        },
      },
      // { $project: { likes: 0, children: 0 } },
    ]);

    return res
      .status(200)
      .json({ success: true, data: updatedData[0], errors: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, data: null, errors: { error: error as string } });
  }
};
