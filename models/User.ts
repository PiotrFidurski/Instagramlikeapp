import { compare, hash } from "bcryptjs";
import { Document, model, Model, models, Schema, Types } from "mongoose";

interface User {
  username: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  image: string;
  changedNameOnSignIn: boolean;
  followers: Types.Array<Document>;
  following: Types.Array<Document>;
  followersCount: number;
  followingCount: number;
  isFollowed: boolean;
  createdAt: Date;
}

export interface UserType extends User {
  _id?: string;
}

export interface UserDocument extends User, Document {
  followersCount: number;
  followingCount: number;
  comparePassword: (password: string) => Promise<Boolean>;
}

export interface UserModel extends Model<UserDocument> {}

export const schema: Schema<UserDocument, UserModel> = new Schema(
  {
    username: {
      type: String,
    },
    name: String,
    email: {
      type: String,
    },
    password: { type: String },
    bio: { type: String },
    image: String,
    changedNameOnSignIn: { type: Boolean, default: false },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isFollowed: { type: Boolean },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

schema.pre<UserDocument>("save", async function(next) {
  if (!this.image) {
    this.image =
      "https://res.cloudinary.com/chimson/image/upload/v1596460624/new-client/placeholder.png";
  }
  if (!this.username) this.username = this.name;
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {}
});

schema.methods.comparePassword = async function(password: string) {
  return await compare(password, this.password);
};

const User =
  (models.User as UserModel) || model<UserDocument, UserModel>("User", schema);
export default User;
