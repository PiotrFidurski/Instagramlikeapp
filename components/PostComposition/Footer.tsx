import { Comment, Heart, HeartFilled } from "@assets/svgs/index";
import { Skeleton } from "@material-ui/lab";
import { PostType } from "@models/Post";
import { useLikePost } from "utils/hooks/useLikePost";

interface Props {
  post: PostType;
  showSkeleton: boolean;
}

const Footer: React.FC<Props> = ({ post, showSkeleton }) => {
  const { mutate } = useLikePost({ post });

  return (
    <div css={{ borderTop: "1px solid var(--border-color)", padding: "8px" }}>
      <div css={{ display: "flex", alignItems: "center" }}>
        <div css={{ display: "flex", flexGrow: 1 }}>
          {showSkeleton ? (
            <Skeleton width={100} />
          ) : (
            <>
              <Comment
                width="22px"
                height="22px"
                fill="var(--primary-text-color)"
                css={{ marginRight: "5px", "&:hover": { cursor: "pointer" } }}
              />

              <div css={{ display: "flex" }} onClick={() => mutate()}>
                {post.isLiked ? (
                  <HeartFilled
                    width="22px"
                    height="22px"
                    fill="#e91e63"
                    css={{ "&:hover": { cursor: "pointer" } }}
                  />
                ) : (
                  <Heart
                    width="22px"
                    height="22px"
                    fill="var(--primary-text-color)"
                    css={{ "&:hover": { cursor: "pointer" } }}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {showSkeleton ? (
          <Skeleton width={150} />
        ) : (
          <div css={{ display: "flex" }}>
            <span
              css={{
                fontSize: "12px",
                color: "var(--tertiary-text-color)",
                "&:hover": {
                  textDecoration: "underline",
                  textDecorationColor: "var(--tertiary-text-color)",
                  cursor: "pointer",
                },
              }}
            >
              {post.commentsCount} comments
            </span>
            <span
              css={{
                padding: "0 5px",
                fontWeight: 600,
                fontSize: 12,
                color: "grey",
              }}
            >
              ·
            </span>

            <span
              css={{
                fontSize: "12px",
                color: "var(--tertiary-text-color)",
                "&:hover": {
                  textDecoration: "underline",
                  textDecorationColor: "var(--tertiary-text-color)",
                  cursor: "pointer",
                },
              }}
            >
              {post.likesCount} likes
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { Footer };
