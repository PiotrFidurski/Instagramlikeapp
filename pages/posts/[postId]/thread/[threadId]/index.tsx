import { api } from "@api/index";
import {
  Cancel,
  Comment,
  CommentFilled,
  Heart,
  HeartFilled,
  Plus,
} from "@assets/svgs/index";
import { CommentLoader } from "@components/CommentLoader";
import { PostComments } from "@components/PostComments";
import { AddComment } from "@components/PostComments/AddComment";
import { Post } from "@components/PostComposition";
import { Content } from "@components/PostComposition/Content";
import { useScroll } from "@components/ScrollContext";
import { css } from "@emotion/react";
import { CommentType } from "@models/Comment";
import { PostType } from "@models/Post";
import { Button, elipsisText, mQ, Spinner } from "@styled";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import * as React from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useLikePost } from "utils/hooks/useLikePost";
import { PaginatedResult } from "utils/types";

interface Props {
  isModal: boolean;
}

export interface Reply {
  inReplyToCommentId: string;
  inReplyToUsername: string;
  prevDepth: number;
  text: string;
}

const Thread: React.FC<Props> = ({ isModal }) => {
  const router = useRouter();

  const [session] = useSession();

  const [reply, setReply] = React.useState<Reply>({
    inReplyToCommentId: "",
    inReplyToUsername: "",
    prevDepth: 0,
    text: "",
  });

  const { data: post } = useQuery<PostType>(
    ["post", router.query.postId],
    () => api.posts.getPostById({ postId: router.query.postId as string }),
    { enabled: !!router.query.postId }
  );

  const {
    data,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<PaginatedResult<CommentType>>(
    ["comments", router.query.postId, router.query.threadId],
    ({ pageParam }) =>
      api.comments.get({
        after: pageParam,
        limit: 20,
        postId: router.query.postId as string,
        threadId: (router.query.threadId as string) || "",
      }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.pageInfo && lastPage.pageInfo.hasNextPage
          ? lastPage.pageInfo.endCursor
          : undefined;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!post,
    }
  );

  const { scrollTo } = useScroll();

  React.useEffect(() => {
    if (!router.query.threadId) {
      if (scrollTo) {
        window.scrollTo(0, scrollTo);
      }
    }
  }, [router, scrollTo]);

  const { mutate } = useLikePost({ post: post ? post : undefined });

  if (!post)
    return (
      <div
        css={{
          maxWidth: "350px",
          margin: "0 auto",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );

  return (
    <div
      css={{
        display: "flex",
        width: "100%",
        flexGrow: 1,
        height: "100%",
        justifyContent: "space-between",
        minWidth: "1000px",
        alignItems: "flex-start",
        [mQ("1040")]: {
          flexDirection: "column",
          alignItems: "center",
          minWidth: "0px",
        },
      }}
    >
      {post ? (
        <Post post={post} isModal={isModal} showSkeleton={false}>
          <Post.Content>
            <Content.Image />
          </Post.Content>
        </Post>
      ) : (
        <Post post={post!} showSkeleton={true}>
          <Post.Content>
            <Content.Image />
          </Post.Content>
        </Post>
      )}
      <div
        css={{
          background: "var(--container-background)",
          border: !isModal ? "1px solid var(--border-color)" : 0,
          display: "flex",
          flexGrow: 1,
          maxWidth: "400px",
          height: "100%",
          maxHeight: "600px",
          borderRadius: "5px",
          flexDirection: "column",
          width: "100%",
          [mQ("1040")]: { maxWidth: "600px", minWidth: "600px" },
          [mQ("mobile")]: {
            flexDirection: "column-reverse",
            maxHeight: "100%",
            border: 0,
            marginTop: "-10px",
            minWidth: "0px",
          },
        }}
      >
        <div
          css={{
            minHeight: "50px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            maxHeight: "50px",
            height: "100%",
            alignItems: "center",
            [mQ("mobile")]: {
              display: "none",
            },
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "center",
              marginLeft: "15px",
            }}
          >
            <Comment
              width="20"
              height="20"
              fill="var(--secondary-text-color)"
            />
            <span
              css={{
                fontSize: 14,
                color: "var(--secondary-text-color)",
                fontWeight: 600,
                marginLeft: "5px",
              }}
            >
              Comments
            </span>
          </div>
        </div>
        <div
          css={{
            borderBottom: "1px solid var(--border-color)",
            padding: "10px 17px",
            overflowY: "scroll",
            maxHeight: "445px",
            minHeight: "445px",
            height: "100%",
            [mQ("mobile")]: {
              overflow: "hidden",
              maxHeight: "100%",
              minHeight: "300px",
              border: 0,
            },
          }}
        >
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {!isLoading &&
              data &&
              data?.pages?.map((page) =>
                page.pages
                  ?.filter((comment) =>
                    router.query.threadId
                      ? comment._id === router.query.threadId
                      : comment.inReplyToCommentId === ""
                  )
                  .map((comment) => (
                    <PostComments
                      reply={reply}
                      setReply={setReply}
                      allowedDepth={5}
                      key={comment._id}
                      comment={comment}
                    />
                  ))
              )}
            {hasNextPage && !isFetching && !router.query.threadId ? (
              <div
                css={{
                  display: "flex",
                  width: "auto",
                  justifyContent: "center",
                  padding: "10px",
                  ":hover": { "> svg": { cursor: "pointer" } },
                }}
              >
                <Plus
                  onClick={() => fetchNextPage()}
                  width="30px"
                  height="30px"
                  fill="var(--primary-text-color)"
                />
              </div>
            ) : null}
            {isFetching ? (
              <>
                <CommentLoader />
                <CommentLoader />
                <CommentLoader />
                <CommentLoader />
                <CommentLoader />
              </>
            ) : null}
          </div>
        </div>
        {session ? (
          <div
            css={{
              position: "sticky",
              zIndex: 2,
              top: "50px",
              background: "var(--container-background)",
              display: "flex",
              flexDirection: "column",
              [mQ("mobile")]: {
                flexDirection: "column-reverse",
              },
            }}
          >
            {reply.inReplyToUsername !== "" ? (
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderBottom: "1px solid var(--border-color)",
                  minHeight: "50px",
                  maxHeight: "50px",
                  padding: "4px 10px",
                }}
              >
                <div css={{ display: "flex" }}>
                  <CommentFilled
                    width="20px"
                    height="20px"
                    fill="var(--secondary-text-color)"
                  />
                </div>
                <div
                  css={{
                    overflow: "hidden",
                    marginLeft: "10px",
                    flexGrow: 1,
                  }}
                >
                  <div>
                    <span
                      css={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: "var(--secondary-text-color)",
                      }}
                    >
                      replying to {reply.inReplyToUsername}:
                    </span>
                  </div>
                  <div css={{ minWidth: "0px", display: "flex" }}>
                    <span
                      css={css`
                        ${elipsisText};
                        font-weight: 700;
                        font-size: 14px;
                        color: var(--tertiary-text-color);
                      `}
                    >
                      {reply.inReplyToUsername}: {reply.text}
                    </span>
                  </div>
                </div>
                <div
                  css={{
                    display: "flex",
                    justifySelf: "flex-end",
                    ":hover": { cursor: "pointer" },
                  }}
                  onClick={() =>
                    setReply({
                      inReplyToCommentId: "",
                      inReplyToUsername: "",
                      prevDepth: 0,
                      text: "",
                    })
                  }
                >
                  <Cancel
                    width="20px"
                    height="20px"
                    fill="var(--secondary-text-color)"
                  />
                </div>
              </div>
            ) : null}
            <div
              css={{
                borderBottom: "1px solid var(--border-color)",
                padding: "10px 17px",
              }}
            >
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  css={{ display: "flex", alignItems: "flex-start" }}
                  onClick={() => mutate()}
                >
                  {post?.isLiked ? (
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
                {router.query.threadId ? (
                  <div>
                    <Button
                      active={false}
                      onClick={() =>
                        router.push(
                          `/posts/${router.query.postId}`,
                          undefined,
                          {
                            scroll: false,
                          }
                        )
                      }
                    >
                      <span
                        css={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--tertiary-text-color)",
                        }}
                      >
                        Go to comments
                      </span>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            <AddComment reply={reply} setReply={setReply} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Thread;
