import { model, Model, models, Schema, Types } from "mongoose";
import { UserType } from "./User";

interface Comment {
  owner: UserType;
  postId: string;
  inReplyToCommentId: string;
  inReplyToUsername: string;
  text: string;
  likes: Types.Array<Document>;
  isLiked: boolean;
  depth: number;
  createdAt: Date;
  likesCount: number;
  children: Array<string>;
  hasChildren: number;
  replies: Array<CommentType>;
  isTombstone: boolean;
}

export interface CommentType extends Comment {
  _id: string;
}

export interface CommentDocument extends Document {}

export interface CommentModel extends Model<CommentDocument> {}

const schema: Schema<CommentDocument, CommentModel> = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: { type: String },
    inReplyToCommentId: { type: String },
    inReplyToUsername: { type: String },
    text: { type: String },
    isTombstone: { type: Boolean, default: false },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    children: [],
    replies: [],
    isLiked: { type: Boolean },
  },
  { timestamps: true }
);

const Comment =
  (models.Comment as CommentModel) ||
  model<CommentDocument, CommentModel>("Comment", schema);

export default Comment;
