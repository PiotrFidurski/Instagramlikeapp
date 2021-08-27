import { userPipeline } from "@api/aggregation";
import User, { UserDocument } from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { PaginatedResult, Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    Response<
      UserDocument | UserDocument[] | null | PaginatedResult<UserDocument>
    >
  >
) => {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { after, limit } = req.query;

        const session = await authorize(req, res);

        const users = await User.aggregate([
          {
            $match: {
              followers: { $nin: [Types.ObjectId(session?.user?._id)] },
              _id: { $ne: Types.ObjectId(session?.user?._id) },
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
          { $sort: { _id: -1 } },
          { $limit: Number(limit) },
          ...userPipeline(session!),
        ]);

        const hasNextPage =
          users.length && users[users.length - 1] !== undefined
            ? !!(await User.findOne({
                followers: {
                  $nin: [Types.ObjectId(session?.user?._id!)],
                } as any,
                _id: {
                  $ne: Types.ObjectId(session?.user?._id),
                  $lt: Types.ObjectId(users[users.length - 1]._id),
                },
              }).sort({ createdAt: -1 }))
            : false;

        return res.status(200).json({
          success: true,
          data: {
            pages: users,
            pageInfo: {
              hasNextPage,
              startCursor: users.length ? users[0]._id! : "",
              endCursor: users.length ? users[users.length - 1]._id! : "",
            },
          },
          errors: {},
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          errors: { message: "Couldn't complete the request." },
          data: null,
        });
      }

    default: {
      res.status(400).json({
        success: false,
        errors: { message: "Couldn't complete the request." },
        data: null,
      });
    }
  }
};
