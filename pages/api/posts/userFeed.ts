import { postPipeline } from "@api/aggregation";
import Post, { PostType } from "@models/Post";
import User from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { PaginatedResult, Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<PaginatedResult<PostType> | null>>
) => {
  const { after } = req.query;

  await dbConnect();

  const session = await authorize(req, res, "paginatedResult");

  try {
    const user = await User.findOne({
      _id: Types.ObjectId(session?.user?._id),
    });

    const following = user?.following.map((u) => u._id);

    const posts: Array<PostType> = await Post.aggregate([
      {
        $match: {
          owner: { $in: [...following!, user!._id] },
          $expr: {
            $cond: {
              if: { $ne: [after, ""] },
              then: {
                $lt: ["$_id", Types.ObjectId(after as string)],
              },
              else: {},
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      ...postPipeline(session!),
    ]);

    const hasNextPage =
      posts.length && posts[posts.length - 1] !== undefined
        ? !!(await Post.findOne({
            owner: { $in: [...following!, user!._id] },
            _id: { $lt: Types.ObjectId(posts[posts.length - 1]._id) },
          }))
        : false;

    return res.status(200).json({
      success: true,
      data: {
        pages: posts,
        pageInfo: {
          hasNextPage,
          startCursor: posts.length ? posts[0]._id! : "",
          endCursor: posts.length ? posts[posts.length - 1]._id! : "",
        },
      },
      errors: {},
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: {
        pages: [],
        pageInfo: {
          hasNextPage: false,
          startCursor: "",
          endCursor: "",
        },
      },
      errors: { error: "bad request" },
    });
  }
};
