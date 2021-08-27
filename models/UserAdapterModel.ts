import Adapters, { TypeORMUserModel } from "next-auth/adapters";
import { EntitySchemaColumnOptions } from "typeorm";

export default class User extends (<any>Adapters.TypeORM.Models.User.model) {
  constructor(
    name: string,
    email: string,
    image: string,
    emailVerified: Date | undefined
  ) {
    super(name, email, image, emailVerified);
    if (this.name) this.name = this.name.toLowerCase();
    if (!this.signedByProvider) this.signedByProvider = true;
    if (!this.username) this.username = this.name!;
    if (!this.followers) this.followers = [];
    if (!this.following) this.following = [];
  }
}

type UserSchema = {
  name: string;
  target: typeof TypeORMUserModel;
  columns: {
    username?: {
      type: "string";
      nullable: boolean;
    };
    signedByProvider?: {
      type: "boolean";
      nullable: boolean;
    };
    followers: {
      type: "array";
      ref: "User";
    };
    following: {
      type: "array";
      ref: "User";
    };
    name?: EntitySchemaColumnOptions;
    email?: EntitySchemaColumnOptions;
    image?: EntitySchemaColumnOptions;
    emailVerified?: EntitySchemaColumnOptions;
  };
};

export const UserSchema: UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    username: {
      type: "string",
      nullable: false,
    },
    signedByProvider: {
      type: "boolean",
      nullable: true,
    },
    followers: {
      type: "array",
      ref: "User",
    },
    following: {
      type: "array",
      ref: "User",
    },
  },
};

Object.defineProperty(User, "name", { value: "User" });
