import { postPipeline } from "@api/aggregation";
import Post, { PostType } from "@models/Post";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import dbConnect from "utils/dbConnect";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<Array<PostType> | null>>
) => {
  const { userId } = req.query;
  await dbConnect();
  const session = await getSession({ req });

  try {
    const posts: Array<PostType> = await Post.aggregate([
      { $match: { owner: Types.ObjectId(userId as string) } },
      ...postPipeline(session),
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({ success: true, data: posts, errors: {} });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
      errors: { error: "bad request" },
    });
  }
};
