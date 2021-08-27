import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { loginSchema } from "schemaValidators/user";
import dbConnect from "utils/dbConnect";
import { formatYupErrors } from "utils/fns";
import { Response } from "utils/types";
import { ValidationError } from "yup";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<UserType | null | []>>
) => {
  await dbConnect();
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    await loginSchema.validate(req.body);

    if (!user)
      return res.status(400).json({
        success: false,
        data: [],
        errors: { email: "couldnt find user with provided email" },
      });

    if (!(await user.comparePassword(req.body.password)))
      return res.status(400).json({
        success: false,
        data: [],
        errors: { password: "wrong password provided" },
      });

    const loginData: Array<UserType> = await User.aggregate([
      { $match: { _id: { $eq: user?._id } } },
      ...userPipeline(null),
    ]);

    return res.status(200).json({
      success: true,
      data: loginData[0],
      errors: [],
    });
  } catch (error) {
    const errors = formatYupErrors(error as ValidationError);
    return res.status(400).json({ success: false, errors, data: [] });
  }
};
