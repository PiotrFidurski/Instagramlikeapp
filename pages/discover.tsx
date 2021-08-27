import { api } from "@api/index";
import { User } from "@components/UserComposition";
import { UserLoader } from "@components/UserLoader";
import { UserType } from "@models/User";
import { mQ } from "@styled";
import { Session } from "next-auth";
import * as React from "react";
import { useInfiniteLoader } from "utils/hooks/useInfiniteLoader";

interface Props {
  users: Array<UserType>;
  session: Session;
}

const DiscoverPage: React.FC<Props> = () => {
  const [{ data, isFetching, isLoading }, setElement] = useInfiniteLoader<
    UserType
  >("suggestedUsers", api.users.getSuggestedUsers, { limit: 20 });

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        color: "var(--primary-text-color)",
        maxWidth: "600px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <span
        css={{
          fontWeight: 600,
          fontSize: 16,
          padding: "10px 0px",
          [mQ("mobile")]: { padding: "10px 10px" },
        }}
      >
        Suggested
      </span>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          borderRadius: "3px",
          height: "auto",
          color: "var(--primary-text-color)",
          background: "var(--container-background)",
          [mQ("mobile")]: { border: 0 },
        }}
      >
        {data?.pages.map((page) =>
          page.pages.map((user, index) => (
            <div key={user._id} ref={setElement}>
              <User
                smaller={false}
                loading={isLoading}
                user={user}
                key={user._id}
                borderBottom={false}
              >
                <User.Avatar />
                <User.Details />
                <User.FollowButton />
              </User>
            </div>
          ))
        )}
        {isFetching ? <UserLoader isLoading={true} /> : null}
      </div>
    </div>
  );
};

export default DiscoverPage;
