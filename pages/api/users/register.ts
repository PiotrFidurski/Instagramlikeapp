import { userPipeline } from "@api/aggregation";
import User, { UserDocument } from "@models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { registerSchema } from "schemaValidators/user";
import dbConnect from "utils/dbConnect";
import { formatYupErrors } from "utils/fns";
import { Response } from "utils/types";
import { ValidationError } from "yup";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<UserDocument | UserDocument[] | null | []>>
) => {
  await dbConnect();

  try {
    const { username, email, password, name } = req.body;

    const emailCheck = await User.findOne({
      email: { $eq: req.body.email },
    });

    await registerSchema.validate(req.body, { abortEarly: false });

    if (emailCheck)
      return res.status(400).json({
        success: false,
        data: [],
        errors: { email: "user with provided email already exists" },
      });

    const usernameCheck = await User.findOne({
      username: { $eq: req.body.username },
    });

    if (usernameCheck) {
      return res.status(400).json({
        success: false,
        data: [],
        errors: { username: "user with provided username already exists" },
      });
    }

    const user = await User.create({ username, email, password, name });

    const newUser = await User.aggregate([
      { $match: { _id: { $eq: user?._id } } },
      ...userPipeline(null),
    ]);

    return res
      .status(200)
      .json({ success: true, data: newUser[0]!, errors: {} });
  } catch (error) {
    const errors = formatYupErrors(error as ValidationError);

    return res.status(400).json({
      success: false,
      errors,
      data: [],
    });
  }
};
