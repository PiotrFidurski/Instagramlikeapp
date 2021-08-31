import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<UserType | null>>
) => {
  const { userId } = req.body;

  try {
    const me = await User.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(userId as string) } } },
      ...userPipeline(null),
    ]);

    return res.status(200).json({ success: true, errors: {}, data: me[0] });
  } catch (error) {
    return res.status(400).json({ success: false, errors: {}, data: null });
  }
};
