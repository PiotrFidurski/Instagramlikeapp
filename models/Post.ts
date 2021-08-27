import { Document, model, Model, models, Schema, Types } from "mongoose";
import { CommentType } from "./Comment";
import { UserType } from "./User";

interface Transformation {
  width: number;
  height: number;
  url: string;
  transformation: string;
}

interface ImageType {
  thumb: Transformation;
  original: Transformation;
}

interface Post {
  description: string;
  image: ImageType;
  likes: Types.Array<Document>;
  comments: Array<CommentType>;
  owner: UserType;
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface PostType extends Post {
  _id?: string;
}

export interface PostDocument extends Post, Document {}

export interface PostModel extends Model<PostDocument> {}

export const schema: Schema<PostDocument, PostModel> = new Schema(
  {
    description: {
      type: String,
    },
    image: {
      thumb: {
        width: { type: Number },
        height: { type: Number },
        url: { type: String },
        transformation: { type: String },
      },
      original: {
        width: { type: Number },
        height: { type: Number },
        url: { type: String },
        transformation: { type: String },
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    isLiked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post =
  (models.Post as PostModel) || model<PostDocument, PostModel>("Post", schema);
export default Post;
