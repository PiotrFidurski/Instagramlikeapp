import { userPipeline } from "@api/aggregation";
import User, { UserType } from "@models/User";
import { hash } from "bcryptjs";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { updatePasswordSchema } from "schemaValidators/user";
import dbConnect from "utils/dbConnect";
import { authorize, formatYupErrors } from "utils/fns";
import { Response } from "utils/types";
import { ValidationError } from "yup";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<any>>
) => {
  const { userId, current_password, new_password, confirm_password } = req.body;
  await dbConnect();

  try {
    const session = await authorize(req, res);

    if (userId !== session?.user?._id) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: {
          password: "You do not have permission to perform this action",
        },
      });
    }

    const user = await User.findById(Types.ObjectId(userId));

    if (!(await user?.comparePassword(current_password))) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: {
          current_password: "The password you entered was incorrect.",
        },
      });
    }

    const hashedPassword = await hash(new_password, 12);

    if (await user?.comparePassword(new_password)) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: {
          new_password:
            "The password you entered was the same as current password.",
        },
      });
    }

    await updatePasswordSchema.validate(
      {
        new_password,
        confirm_password,
      },
      { abortEarly: false }
    );

    const update = await User.findOneAndUpdate(
      { _id: { $eq: Types.ObjectId(userId) } },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    await update?.save();

    const updatedUser: Array<UserType> = await User.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(userId) } } },
      ...userPipeline(session!),
    ]);

    return res
      .status(200)
      .json({ success: true, data: updatedUser[0], errors: {} });
  } catch (error) {
    const errors = formatYupErrors(error as ValidationError);
    return res.status(400).json({
      success: false,
      data: null,
      errors,
    });
  }
};
