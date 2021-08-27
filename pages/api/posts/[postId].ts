import { postPipeline } from "@api/aggregation";
import Post, { PostType } from "@models/Post";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import dbConnect from "utils/dbConnect";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<PostType | null>>
) => {
  const { postId } = req.query;

  await dbConnect();

  const session = await getSession({ req });

  try {
    const post: Array<PostType> = await Post.aggregate([
      { $match: { _id: Types.ObjectId(postId as string) } },
      ...postPipeline(session),
    ]);

    return res.status(200).json({ success: true, data: post[0], errors: {} });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
      errors: { error: "bad request" },
    });
  }
};
