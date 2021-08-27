import { UserType } from "@models/User";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserType;
  }
}
