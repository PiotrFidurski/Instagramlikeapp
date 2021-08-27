import { UserType } from "@models/User";
import { useRouter } from "next/router";
import * as React from "react";
import { useFollowUser } from "utils/hooks/useFollowUser";
import { Avatar, AvatarProps } from "./Avatar";
import { Details, DetailsProps } from "./Details";
import { FollowButton, FollowButtonProps } from "./FollowButton";

interface Props {
  user: UserType;
  borderBottom: boolean;
  loading: boolean;
  smaller?: boolean;
}

interface UserComposition {
  Avatar: React.FC<AvatarProps>;
  Details: React.FC<DetailsProps>;
  FollowButton: React.FC<FollowButtonProps>;
}

export const User: React.FC<Props> & UserComposition = ({
  user,
  borderBottom,
  children,
  loading,
  smaller,
}) => {
  const router = useRouter();

  const { mutate } = useFollowUser({ user });

  function handleClick(username: string) {
    if (window.getSelection()?.isCollapsed) {
      router.push(`/${username}`);
    }
  }

  return (
    <div
      onClick={() => handleClick(user.username)}
      key={user._id}
      css={{
        padding: "13px 10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "all 0.2s ease-in",
        justifyContent: "space-between",
        "&:hover": {
          background: "var(--container-hover-background)",
        },
        borderBottom: borderBottom ? "1px solid var(--border-color)" : 0,
      }}
    >
      <div
        css={{
          display: "flex",
          flexGrow: 1,
          minWidth: "0px",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "flex-start",
        }}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement, {
            follow: mutate,
            image: user.image,
            loading,
            user,
            smaller,
          })
        )}
      </div>
    </div>
  );
};

User.Avatar = Avatar;
User.Details = Details;
User.FollowButton = FollowButton;
