import { userPipeline } from "@api/aggregation";
import User from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "utils/dbConnect";
import { authorize } from "utils/fns";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<any>>
) => {
  await dbConnect();
  const session = await authorize(req, res);

  try {
    const userToFollow = await User.aggregate([
      {
        $match: {
          _id: Types.ObjectId(req.body.userId),
        },
      },
      ...userPipeline(session!),
    ]);

    const user = await User.findOne({
      _id: { $eq: Types.ObjectId(session?.user?._id) },
    });

    if (userToFollow[0]!.isFollowed) {
      await User.updateOne(
        {
          _id: { $eq: Types.ObjectId(session?.user?._id) },
        },
        { $pull: { following: { $in: [userToFollow[0]] } } }
      );
      await User.updateOne(
        {
          _id: { $eq: Types.ObjectId(req.body.userId) },
        },
        { $pull: { followers: { $in: [user!] } } },
        { new: true }
      );
    } else {
      await User.updateOne(
        {
          _id: { $eq: Types.ObjectId(session?.user?._id) },
        },
        { $push: { following: userToFollow[0] } }
      );
      await User.updateOne(
        {
          _id: { $eq: Types.ObjectId(req.body.userId) },
        },
        { $push: { followers: user! } },
        { new: true }
      );
    }

    const updated = await User.aggregate([
      {
        $match: {
          _id: Types.ObjectId(req.body.userId),
        },
      },
      ...userPipeline(session!),
    ]);

    return res
      .status(200)
      .json({ success: true, data: updated[0], errors: {} });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
      errors: { error: "Couldn't complete the request." },
    });
  }
};
