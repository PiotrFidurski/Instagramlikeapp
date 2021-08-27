import Skeleton from "@material-ui/lab/Skeleton";
import { UserType } from "@models/User";
import { Button, elipsisText } from "@styled";
import * as React from "react";

export interface FollowButtonProps {
  loading?: boolean;
  user?: UserType;
  follow?: () => void;
  smaller?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  loading,
  user,
  follow,
  smaller,
}) => {
  return (
    <div
      css={{
        display: "flex",
        alignSelf: "center",
        flexGrow: 1,
        alignItems: "center",
        minWidth: "103px",
        maxWidth: "103px",
        fontSize: smaller ? "12px" : "15px",
      }}
    >
      {loading ? (
        <Skeleton width={130} height={40} />
      ) : (
        <Button
          active={user?.isFollowed!}
          onClick={(e) => {
            e.stopPropagation();
            follow?.();
          }}
        >
          <span css={elipsisText}>
            {user?.isFollowed ? "Following" : "Follow"}
          </span>
        </Button>
      )}
    </div>
  );
};
