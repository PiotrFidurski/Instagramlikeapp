import { postPipeline } from "@api/aggregation";
import Post, { PostType } from "@models/Post";
import User from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<PostType | null>>
) => {
  const session = await authorize(req, res);
  await dbConnect();

  try {
    const post = await Post.aggregate([
      {
        $match: {
          _id: Types.ObjectId(req.body.postId),
        },
      },
      ...postPipeline(session!),
    ]);

    const user = await User.findOne({
      _id: { $eq: Types.ObjectId(session?.user?._id) },
    });

    if (post[0]!.isLiked) {
      await Post.updateOne(
        {
          _id: { $eq: Types.ObjectId(req.body.postId) },
        },
        { $pull: { likes: { $in: [user!] } } },
        { new: true }
      );
    } else {
      await Post.updateOne(
        {
          _id: { $eq: Types.ObjectId(req.body.postId) },
        },
        { $push: { likes: user! } },
        { new: true }
      );
    }
    const updated: Array<PostType> = await Post.aggregate([
      {
        $match: {
          _id: Types.ObjectId(req.body.postId),
        },
      },
      ...postPipeline(session!),
    ]);
    return res
      .status(200)
      .json({ success: true, data: updated[0], errors: {} });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
      errors: { error: "bad request" },
    });
  }
};
