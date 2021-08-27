import { User } from "./UserComposition";

const stubUser = {
  _id: "1",
  username: "",
  name: "",
  email: "",
  password: "",
  image: "/worry.png",
  changedNameOnSignIn: false,
  followers: [] as any,
  following: [] as any,
  followersCount: 0,
  followingCount: 0,
  isFollowed: false,
  createdAt: "" as any,
};

interface Props {
  isLoading: boolean;
  smaller?: boolean;
}

export const UserLoader: React.FC<Props> = ({ isLoading, smaller = false }) => (
  <>
    <User
      loading={isLoading}
      user={stubUser}
      borderBottom={false}
      smaller={smaller}
    >
      <User.Avatar />
      <User.Details />
      <User.FollowButton />
    </User>
    <User
      loading={isLoading}
      user={stubUser}
      borderBottom={false}
      smaller={smaller}
    >
      <User.Avatar />
      <User.Details />
      <User.FollowButton />
    </User>
    <User
      loading={isLoading}
      user={stubUser}
      borderBottom={false}
      smaller={smaller}
    >
      <User.Avatar />
      <User.Details />
      <User.FollowButton />
    </User>
    <User
      loading={isLoading}
      user={stubUser}
      borderBottom={false}
      smaller={smaller}
    >
      <User.Avatar />
      <User.Details />
      <User.FollowButton />
    </User>
    <User
      loading={isLoading}
      user={stubUser}
      borderBottom={false}
      smaller={smaller}
    >
      <User.Avatar />
      <User.Details />
      <User.FollowButton />
    </User>
  </>
);
