import Post, { schema as postSchema } from "./Post";
import _User, { schema as userSchema } from "./User";
import User, { UserSchema } from "./UserAdapterModel";

export default {
  users: { model: User, schema: UserSchema },
  User: { model: _User, schema: userSchema },
  Post: { model: Post, schema: postSchema },
};
