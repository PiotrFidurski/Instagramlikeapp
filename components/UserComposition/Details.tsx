import { css } from "@emotion/react";
import Skeleton from "@material-ui/lab/Skeleton";
import { UserType } from "@models/User";
import { elipsisText } from "@styled";
import Link from "next/link";

export interface DetailsProps {
  loading?: boolean;
  user?: UserType;
  smaller?: boolean;
}

export const Details: React.FC<DetailsProps> = ({ loading, user, smaller }) => {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        margin: "0 10px",
        flexGrow: 1,
        fontSize: smaller ? 12 : 15,
        color: "var(--secondary-text-color)",
        fontWeight: 600,
      }}
    >
      {loading ? (
        <Skeleton variant="text" width={80} />
      ) : (
        <Link href={`/${user?.username}`}>
          <a css={{ display: "flex" }}>
            <span
              css={css`
                &:hover {
                  text-decoration: underline;
                  text-decoration-color: var(--secodary-text-color);
                }
                ${elipsisText}
              `}
            >
              {user?.username}
            </span>
          </a>
        </Link>
      )}
      <div
        css={{
          minWidth: "0px",
          display: "flex",
        }}
      >
        {loading ? (
          <Skeleton variant="text" width={120} />
        ) : (
          <span
            css={css`
              ${elipsisText};
              font-size: ${smaller ? "10px" : "12px"};
              font-weight: 500;
              color: var(--tertiary-text-color);
            `}
          >
            {user?.bio}
          </span>
        )}
      </div>
    </div>
  );
};
