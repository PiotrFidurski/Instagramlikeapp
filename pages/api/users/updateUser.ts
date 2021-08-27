import { userPipeline } from "@api/aggregation";
import { CloudinaryResponse, PrasedForm } from "@api/index";
import User, { UserType } from "@models/User";
import formidable, { File } from "formidable";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { updateSchema } from "schemaValidators/user";
import { authorize, formatYupErrors } from "utils/fns";
import { Response } from "utils/types";
import { ValidationError } from "yup";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: { bodyParser: false },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<UserType | null>>
) => {
  try {
    const session = await authorize(req, res);

    const form = new formidable.IncomingForm({
      keepExtensions: true,
      multiples: true,
    });

    const parsedForm: PrasedForm = await new Promise((resolve, reject) => {
      form.parse(req, (error, fields, { file }) => {
        if (error) reject(error);
        resolve({ fields, file });
      });
    });

    const { username, userId, bio, name } = parsedForm.fields;

    await updateSchema.validate(
      {
        name: name || session?.user?.name,
        username,
        bio,
        file: parsedForm.file || { size: 1000, type: "image/jpeg" },
      },
      { abortEarly: false }
    );

    if (session?.user?._id !== userId) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: {
          username: "You do not have permission to perform this action",
        },
      });
    }

    const existingUser = await User.findOne({
      username: username as string,
      _id: { $ne: Types.ObjectId(userId) },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: {
          username: "this username is already taken.",
        },
      });
    }

    const eager = [
      {
        width: 150,
        height: 150,
        crop: "thumb",
        gravity: "center",
      },
    ];

    if (parsedForm.file) {
      const clouadinaryUpload: CloudinaryResponse = await cloudinary.uploader.upload(
        (parsedForm.file as File).path,
        { folder: "picturefeed", eager },
        (error: any, result: CloudinaryResponse) => {
          if (error) {
            throw new Error("Something went wrong with cloudinary upload.");
          }
          return result;
        }
      );
      await User.findOneAndUpdate(
        {
          _id: Types.ObjectId(session?.user?._id),
        },
        {
          $set: {
            image: clouadinaryUpload.eager[0].secure_url,
          },
        },
        { new: true }
      );
    }

    const user = await User.findOneAndUpdate(
      {
        _id: Types.ObjectId(session?.user?._id),
      },
      {
        $set: {
          username: (username as string).trim(),
          changedNameOnSignIn: false,
          bio: (bio as string).trim(),
          name: (name as string).trim(),
        },
      },
      { new: true }
    );

    const updatedUser = await User.aggregate([
      { $match: { _id: { $eq: user?._id } } },
      ...userPipeline(session!),
    ]);

    return res
      .status(200)
      .json({ success: true, data: updatedUser[0], errors: {} });
  } catch (error) {
    const errors = formatYupErrors(error as ValidationError);
    return res.status(400).json({
      success: false,
      errors,
      data: null,
    });
  }
};
