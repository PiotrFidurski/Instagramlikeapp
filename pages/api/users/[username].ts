import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Response } from "utils/types";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<UserType | null>>
) {
  const { username } = req.query;

  await dbConnect();

  const session = await getSession({ req });

  try {
    const user = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      ...userPipeline(session!),
    ]);

    if (!user.length) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: { message: "cant find user with that username" },
      });
    }
    return res.status(200).json({ success: true, data: user[0], errors: [] });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, errors: [] });
  }
}
