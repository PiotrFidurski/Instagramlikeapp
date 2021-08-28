import { postPipeline } from "@api/aggregation";
import { CloudinaryResponse, PrasedForm } from "@api/index";
import Post, { PostType } from "@models/Post";
import User from "@models/User";
import formidable, { File } from "formidable";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { createSchema } from "schemaValidators/post";
import dbConnect from "utils/dbConnect";
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
  api: {
    bodyParser: false,
  },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<PostType | null>>
) => {
  const session = await authorize(req, res);
  await dbConnect();

  try {
    const owner = await User.findById(Types.ObjectId(session?.user?._id));

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

    await createSchema.validate(
      {
        description: parsedForm.fields.description,
        file: parsedForm.file,
      },
      { abortEarly: false }
    );

    const eager = [
      {
        width: 1080,
        height: 1080,
        gravity: "center",
        angle: Number(parsedForm.fields.angle),
      },
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "north",
        angle: Number(parsedForm.fields.angle),
      },
    ];

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

    const image = {
      thumb: {
        width: clouadinaryUpload.eager[1].width,
        height: clouadinaryUpload.eager[1].height,
        url: clouadinaryUpload.eager[1].secure_url,
        transformation: clouadinaryUpload.eager[1].transformation,
      },
      original: {
        width: clouadinaryUpload.eager[0].width,
        height: clouadinaryUpload.eager[0].height,
        url: clouadinaryUpload.eager[0].secure_url,
        transformation: clouadinaryUpload.eager[0].transformation,
      },
    };

    const values = { description: parsedForm.fields.description, image, owner };

    const post = await Post.create(values);

    const createdPost: Array<PostType> = await Post.aggregate([
      { $match: { _id: { $eq: post?._id } } },
      ...postPipeline(session!),
    ]);

    return res
      .status(200)
      .json({ success: true, data: createdPost[0], errors: {} });
  } catch (error) {
    const errors = formatYupErrors(error as ValidationError);
    return res.status(400).json({
      success: false,
      data: null,
      errors,
    });
  }
};
