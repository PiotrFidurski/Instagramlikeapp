import { More } from "@assets/svgs/index";
import { PostMenu } from "@components/PostMenu";
import { css } from "@emotion/react";
import { Skeleton } from "@material-ui/lab";
import { PostType } from "@models/Post";
import { elipsisText } from "@styled";
import { format } from "date-fns";
import Link from "next/link";
import * as React from "react";

interface Props {
  post: PostType;
  showSkeleton: boolean;
}

export const Details: React.FC<Props> = ({ post, showSkeleton }) => {
  const [active, setActive] = React.useState(false);

  return (
    <div
      css={{
        padding: "10px 10px",
      }}
    >
      <div
        css={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {showSkeleton ? (
          <Skeleton width={150} />
        ) : (
          <div css={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Link href={`/${post.owner.username}`}>
              <a css={{ maxWidth: "200px", minWidth: "0px", display: "flex" }}>
                <span
                  css={css`
                    color: var(--primary-text-color);
                    font-weight: 600;
                    &:hover {
                      cursor: pointer;
                      text-decoration: underline;
                    }
                    ${elipsisText};
                  `}
                >
                  {post.owner.username}
                </span>
              </a>
            </Link>
            <span
              css={{
                padding: "0 5px",
                fontWeight: 600,
                color: "var(--tertiary-text-color)",
              }}
            >
              ·
            </span>
            <span
              css={{ fontSize: "12px", color: "var(--tertiary-text-color)" }}
            >
              {format(new Date(post.createdAt), "dd, LLLL, yyyy")}
            </span>
          </div>
        )}
        <div css={{ position: "relative" }}>
          <div
            onClick={(e: any) => {
              e.stopPropagation();

              setActive(!active);
            }}
            css={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              borderRadius: "50%",
              padding: "5px",
              "&:hover": { background: "var(--border-color)" },
            }}
          >
            {showSkeleton ? (
              <Skeleton width={20} height={20} />
            ) : (
              <More
                width="1.25em"
                height="1.25em"
                fill="var(--tertiary-text-color)"
                css={{
                  display: "flex",
                }}
              />
            )}
          </div>

          {active ? <PostMenu post={post} setActive={setActive} /> : null}
        </div>
      </div>
      {showSkeleton ? (
        <Skeleton width={200} />
      ) : (
        <div
          css={{
            marginTop: "5px",
            fontSize: 14,
            color: "var(--secondary-text-color)",
          }}
        >
          {post.description}
        </div>
      )}
    </div>
  );
};
