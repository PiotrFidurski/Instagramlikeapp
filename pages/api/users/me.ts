import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<UserType | null>>
) => {
  const session = await getSession({ req });

  try {
    const me = await User.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(session?.user?._id) } } },
      ...userPipeline(session!),
    ]);

    return res.status(200).json({ success: true, errors: {}, data: me[0] });
  } catch (error) {
    return res.status(400).json({ success: false, errors: {}, data: null });
  }
};
