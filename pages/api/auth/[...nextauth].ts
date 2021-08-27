import { userPipeline } from "@api/aggregation";
import models from "@models/index";
import User, { UserType } from "@models/User";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { DefaultUser } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import dbConnect from "utils/dbConnect";

const options = (context: { req: NextApiRequest; res: NextApiResponse }) => ({
  cookie: {
    secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  },
  pages: {
    signIn: "/login",
  },
  session: { jwt: true, maxAge: 30 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  database: process.env.MONGODB_URI!,
  secret: process.env.NEXTAUTH_SECRET!,
  debug: true,
  callbacks: {
    async jwt(
      token: any,
      user:
        | (DefaultUser & {
            id?: string;
            _id?: string;
          })
        | undefined
    ) {
      // console.log({ jwtcb: { token, user } });
      // if (token.sub !== undefined) {
      // user comes from credentials callback
      // }
      // await dbConnect();

      // const dbUser = await User.findOne({
      //   $or: [
      //     { _id: { $eq: Types.ObjectId(user?.id!) } },
      //     { _id: { $eq: Types.ObjectId(user?._id!) } },
      //   ],
      // });

      user && (token.user = user);

      return token;
    },
    async session(
      session: { user: any; expires?: string | undefined },
      user: {
        user: DefaultUser & {
          username: string | undefined;
          _id: string | undefined;
          id: string;
        };
      }
    ) {
      await dbConnect();

      const currentUser = await User.findOne({
        $or: [
          { _id: { $eq: Types.ObjectId(user?.user.id!) } },
          { _id: { $eq: Types.ObjectId(user?.user._id!) } },
        ],
      });

      const sameUsername = await User.findOne({
        _id: { $ne: Types.ObjectId(currentUser?._id) },
        username: { $eq: currentUser?.username },
      });

      if (sameUsername) {
        await User.findOneAndUpdate(
          {
            _id: { $eq: Types.ObjectId(currentUser?._id!) },
          },
          {
            $set: {
              username: `${
                currentUser?.name
              }${currentUser?._id.toString()?.slice(20)}`,
              changedNameOnSignIn: true,
            },
          },
          { new: true }
        );
      }

      const dbUser: Array<UserType> = await User.aggregate([
        {
          $match: {
            $or: [
              { _id: { $eq: Types.ObjectId(user?.user?.id) } },
              { _id: { $eq: Types.ObjectId(user?.user?._id) } },
            ],
          },
        },
        ...userPipeline(null),
      ]);
      if (dbUser.length) session.user! = dbUser[0];

      return session;
    },
  },
  adapter: Adapters.TypeORM.Adapter(process.env.MONGODB_URI!, {
    models: {
      ...Adapters.TypeORM.Models,
      User: models.users,
    },
  }),
});

const providers = [
  Providers.GitHub({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    profile(profile: any) {
      return {
        id: profile.id,
        signedByProvider: true,
        name: profile.login,
        username: profile.login,
        email: "",
        image: profile.avatar_url,
      };
    },
  }),
  Providers.Discord({
    clientId: process.env.DISCORD_ID!,
    clientSecret: process.env.DISCORD_SECRET!,
    profile(profile: any) {
      return {
        username: profile.username,
        signedByProvider: true,
        id: profile.id,
        name: profile.username,
        email: "",
        image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`,
      };
    },
  }),
  Providers.Google({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    profile(profile: any) {
      return {
        username: profile.username,
        id: profile.id,
        signedByProvider: true,
        name: profile.name,
        email: "",
        image: profile.picture,
      };
    },
  }),
  Providers.Twitter({
    clientId: process.env.TWITTER_ID!,
    clientSecret: process.env.TWITTER_SECRET!,
    profile(profile: any) {
      return {
        username: profile.name,
        id: profile.id,
        signedByProvider: true,
        name: profile.name,
        email: "",
        image: profile.profile_image_url,
      };
    },
  }),
  Providers.Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ email }: { email: string; password: string }) {
      await dbConnect();
      const user = await User.aggregate([
        { $match: { email: { $eq: email as string } } },
        ...userPipeline(null),
      ]);

      if (!user.length) {
        return null;
      }
      return user[0];
    },
  }),
];

const config = (context: { req: NextApiRequest; res: NextApiResponse }) => ({
  providers,
  ...options(context),
});

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, config({ req, res }));
