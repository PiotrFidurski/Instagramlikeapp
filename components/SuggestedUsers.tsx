import { api } from "@api/index";
import { UserType } from "@models/User";
import { Button } from "@styled";
import Link from "next/link";
import * as React from "react";
import { useQuery } from "react-query";
import { PaginatedResult } from "utils/types";
import { User } from "./UserComposition/index";
import { UserLoader } from "./UserLoader";

export const SuggestedUsers: React.FC = () => {
  const { data, isLoading } = useQuery<PaginatedResult<UserType>>(
    "nonPaginatedSuggestedUsers",
    () => api.users.getSuggestedUsers({ after: "", limit: 5 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (!isLoading && !data?.pages.length) return <></>;

  return (
    <>
      <div
        css={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4 css={{ fontWeight: 500, color: "var(--secondary-text-color)" }}>
          Suggestions For You
        </h4>
        <div css={{ maxWidth: "100px" }}>
          <Link href="/discover">
            <Button active={false}>
              <span css={{ fontSize: 12, color: "var(--primary-text-color)" }}>
                See all
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div
        css={{
          borderLeft: "1px solid var(--border-color)",
          borderTop: "1px solid var(--border-color)",
          borderRight: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
          borderRadius: "3px",
          background: "var(--container-background)",
        }}
      >
        {!isLoading ? (
          data?.pages?.map((user, index) => (
            <User
              key={user._id}
              user={user}
              borderBottom={index !== data.pages.length - 1}
              loading={isLoading}
              smaller={false}
            >
              <User.Avatar />
              <User.Details />
              <User.FollowButton />
            </User>
          ))
        ) : (
          <UserLoader isLoading={isLoading} />
        )}
      </div>
    </>
  );
};
