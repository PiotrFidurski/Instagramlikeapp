import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import dbConnect from "utils/dbConnect";
import { PaginatedResult, Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<PaginatedResult<UserType> | null>>
) => {
  await dbConnect();
  const session = await getSession({ req });
  const { query, after, limit } = req.query;
  try {
    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: new RegExp(query as string) },
          $expr: {
            $cond: {
              if: { $ne: [after, ""] },
              then: { $lt: ["$_id", Types.ObjectId(after as string)] },
              else: {},
            },
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      { $limit: Number(limit) },
      ...userPipeline(session),
    ]);

    const hasNextPage =
      users[users.length - 1] !== undefined
        ? !!(await User.findOne({
            username: { $regex: new RegExp(query as string) },
            _id: { $lt: Types.ObjectId(users[users.length - 1]._id) },
          }))
        : false;

    return res.status(200).json({
      errors: {},
      data: {
        pages: users,
        pageInfo: {
          hasNextPage,
          startCursor: users.length ? users[0]._id! : "",
          endCursor: users.length ? users[users.length - 1]._id! : "",
        },
      },
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: error as {}, data: null, success: false });
  }
};
