import { Cancel, Heart, HeartFilled, Plus } from "@assets/svgs/index";
import { CommentLoader } from "@components/CommentLoader";
import { useModal } from "@components/Modals/ModalComposition/context";
import { useScroll } from "@components/ScrollContext";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CommentType } from "@models/Comment";
import { AvatarWrapper, elipsisText, mQ } from "@styled";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Reply } from "pages/posts/[postId]/thread/[threadId]";
import * as React from "react";
import { useLikeComment } from "utils/hooks/useLikeComment";
import { useLoadMoreComments } from "utils/hooks/useLoadMoreComments";

const ThreadedLine = styled.a`
  display: block;
  position: absolute;
  top: 35px;
  left: 12.5px;
  z-index: 0;
  width: 10px;
  height: calc(100% - 50px);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  background-color: var(--tertiary-text-color);
  background-clip: padding-box;
  :hover {
    cursor: pointer;
    background-color: var(--primary-text-color);
  }
`;

interface Props {
  comment: CommentType;
  allowedDepth: number;
  setReply: React.Dispatch<React.SetStateAction<Reply>>;
  reply: Reply;
}

export const PostComments: React.FC<Props> = ({ ...props }) => {
  const { comment, allowedDepth = 4, setReply, reply } = props;

  const { setModal } = useModal();

  const router = useRouter();

  const [session] = useSession();

  const [collapsed, setCollapsed] = React.useState(false);

  const queryKeys = [
    router.query.postId as string,
    router.query.threadId as string,
  ];

  const { mutate, isLoading } = useLoadMoreComments({
    comment: comment,
    queryKeys,
  });

  const { mutate: like } = useLikeComment({
    comment: comment,
    queryKeys,
  });

  const commentRef = React.useRef<HTMLDivElement | null>(null);

  const { commentId, setScroll } = useScroll();

  React.useEffect(() => {
    if (commentId === commentRef?.current?.id) {
      commentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [router, commentId]);

  return (
    <div css={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      {comment.depth !== null && comment.depth <= allowedDepth ? (
        <>
          {!collapsed ? (
            <div
              css={{ position: "relative", marginTop: "10px", width: "100%" }}
              id={comment._id}
            >
              {comment.hasChildren ? (
                <ThreadedLine onClick={() => setCollapsed(true)} />
              ) : null}

              <div id={comment._id} ref={commentRef}>
                <div
                  css={{
                    padding: "5px",
                    borderRadius: "3px",
                    position: "relative",
                    border:
                      router.query.threadId === comment._id
                        ? "1px solid var(--border-color)"
                        : 0,
                    boxShadow:
                      router.query.threadId === comment._id
                        ? "0 0 4px 0 var(--shadow-color)"
                        : "unset",
                    background:
                      router.query.threadId === comment._id
                        ? "#607d8b1c"
                        : comment.isTombstone
                        ? "linear-gradient(45deg, var(--background-color) 10%, #03a9f424 70%, #2196f32e);"
                        : "unset",
                  }}
                >
                  <div
                    css={{
                      padding: "2px 0",
                      display: "flex",
                      alignItems: "flex-start",
                      height: "auto",
                      fontSize: "14px",
                    }}
                  >
                    <div css={{ width: "25px", height: "25px" }}>
                      {!comment.isTombstone ? (
                        <Link href={`/${comment.owner.username}`}>
                          <a>
                            <AvatarWrapper width="25px" height="25px">
                              <Image
                                src={comment.owner.image}
                                objectFit="contain"
                                width="150px"
                                height="150px"
                                layout="responsive"
                              />
                            </AvatarWrapper>
                          </a>
                        </Link>
                      ) : (
                        <AvatarWrapper width="25px" height="25px">
                          <Image
                            src={comment.owner.image}
                            objectFit="contain"
                            width="150px"
                            height="150px"
                            layout="responsive"
                          />
                        </AvatarWrapper>
                      )}
                    </div>
                    <div css={{ marginLeft: "5px" }}>
                      {!comment.isTombstone ? (
                        <Link href={`/${comment.owner.username}`}>
                          <a>
                            <span
                              css={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "var(--primary-text-color)",
                                marginRight: "5px",
                                fontStyle: comment.isTombstone
                                  ? "italic"
                                  : "normal",
                                "&:hover": {
                                  textDecoration: "underline",
                                  textDecorationColor:
                                    "var(--primary-text-color)",
                                  cursor: "pointer",
                                },
                              }}
                            >
                              {comment.owner.username}
                            </span>
                          </a>
                        </Link>
                      ) : (
                        <span
                          css={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "var(--primary-text-color)",
                            marginRight: "5px",
                            fontStyle: comment.isTombstone
                              ? "italic"
                              : "normal",
                          }}
                        >
                          {comment.owner.username}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    css={{
                      paddingLeft: "30px",
                      paddingRight: "4px",
                      marginTop: "-10px",
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    {!comment.isTombstone ? (
                      <span
                        css={{
                          fontSize: 14,
                          wordBreak: "break-word",
                          paddingRight: "5px",
                          color: "var(--secondary-text-color)",
                        }}
                      >
                        {comment.text}
                      </span>
                    ) : null}
                    <div css={{ flexDirection: "column", height: "0px" }}>
                      {!comment.isTombstone ? (
                        <div
                          css={{ display: "flex", marginBottom: "5px" }}
                          onClick={() => like()}
                        >
                          {comment.isLiked ? (
                            <HeartFilled
                              width="15"
                              height="15"
                              fill="#e91e63"
                              css={{ "&:hover": { cursor: "pointer" } }}
                            />
                          ) : (
                            <Heart
                              width="15"
                              height="15"
                              fill="var(--primary-text-color)"
                              css={{ "&:hover": { cursor: "pointer" } }}
                            />
                          )}
                        </div>
                      ) : null}
                      {!comment.isTombstone &&
                      comment.owner?._id === session?.user?._id ? (
                        <div
                          css={{
                            display: "flex",
                            "&:hover": {
                              cursor: "pointer",
                              "> svg": { fill: "#ef5350" },
                            },
                          }}
                          onClick={() =>
                            setModal((modal) => ({
                              ...modal,
                              key: "DELETE_COMMENT",
                              open: true,
                              props: { comment, queryKeys },
                            }))
                          }
                        >
                          <Cancel
                            width="15"
                            height="15"
                            fill="var(--primary-text-color)"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    css={{
                      paddingLeft: "28px",
                      paddingBottom: "2px",
                      maxWidth: "225px",
                      display: "flex",
                      minWidth: "0px",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      color: "var(--tertiary-text-color)",
                      [mQ("mobileSmall")]: {
                        display: "flex",
                        flexDirection: "column",
                        "> span ": {
                          margin: "0 0 3px 0",
                        },
                      },
                    }}
                  >
                    <div
                      css={{
                        display: "flex",
                        minWidth: "0px",
                        maxWidth: "100px",
                      }}
                    >
                      <span
                        css={{
                          fontSize: 12,
                          fontWeight: 700,
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          "&:hover": {
                            cursor: "pointer",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {formatDistanceToNow(new Date(comment?.createdAt!))} ago
                      </span>
                    </div>
                    {comment.likesCount > 0 ? (
                      <span
                        css={{
                          fontSize: 12,
                          marginLeft: "15px",
                          fontWeight: 700,
                          "&:hover": {
                            cursor: "pointer",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {comment.likesCount > 1
                          ? `${comment.likesCount} likes`
                          : `${comment.likesCount} like`}
                      </span>
                    ) : null}
                    <span
                      onClick={() => {
                        setReply({
                          inReplyToCommentId: comment._id,
                          inReplyToUsername: comment.owner?.username,
                          prevDepth: comment.depth,
                          text: comment.text,
                        });
                      }}
                      css={{
                        fontSize: 12,
                        marginLeft: "15px",
                        fontWeight: 700,
                        "&:hover": {
                          cursor: "pointer",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Reply
                    </span>
                  </div>
                </div>

                {comment.depth === allowedDepth &&
                Boolean(comment.hasChildren) ? (
                  <Link
                    href={`/posts/${router.query.postId}/thread/${comment._id}`}
                  >
                    <div
                      onClick={() => {
                        if (!router.query.threadId) {
                          setScroll({
                            scrollTo: window.scrollY,
                            commentId: comment._id,
                          });
                        }
                      }}
                      css={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid var(--border-color)",
                        borderRadius: "9999px",
                        width: "fit-content",
                        marginLeft: "35px",
                        padding: "2px 5px",
                        "&:hover": {
                          cursor: "pointer",
                          "> span": {
                            textDecoration: "underline",
                            color: "var(--primary-text-color)",
                          },
                          "> svg": {
                            fill: "var(--primary-text-color)",
                          },
                        },
                      }}
                    >
                      <span
                        css={{
                          fontSize: 12,
                          color: "var(--tertiary-text-color)",
                          fontWeight: 700,
                          marginRight: "5px",
                        }}
                      >
                        Continue this thread
                      </span>
                      <Plus
                        fill="var(--tertiary-text-color)"
                        width="15px"
                        height="15px"
                      />
                    </div>
                  </Link>
                ) : null}
                {comment.hasChildren > 0 && comment.depth < allowedDepth ? (
                  <div css={{ marginLeft: "20px" }} id="replies">
                    {comment.replies?.map((comment) => (
                      <PostComments
                        reply={reply}
                        setReply={setReply}
                        comment={comment}
                        allowedDepth={allowedDepth}
                        key={comment._id}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div
              css={{
                display: "flex",
                alignItems: "center",
                height: "auto",
                fontSize: "14px",
                padding: "5px",
                margin: "10px 0",
              }}
            >
              <div
                onClick={() => setCollapsed(false)}
                css={{
                  display: "flex",
                  marginRight: "5px",
                  alignItems: "center",
                  "&:hover": {
                    cursor: "pointer",
                    "> svg": { fill: "var(--primary-text-color)" },
                  },
                }}
              >
                <Plus
                  width="20px"
                  height="20px"
                  fill="var(--tertiary-text-color)"
                />
              </div>
              <div css={{ width: "20px", height: "20px" }}>
                <Link href={`/${comment.owner.username}`}>
                  <a>
                    <AvatarWrapper width="20px" height="20px">
                      <Image
                        src={comment.owner.image}
                        objectFit="contain"
                        width="150px"
                        height="150px"
                        layout="responsive"
                      />
                    </AvatarWrapper>
                  </a>
                </Link>
              </div>
              <div css={{ marginLeft: "5px" }}>
                <Link href={`/${comment.owner.username}`}>
                  <a>
                    <span
                      css={{
                        fontWeight: 600,
                        fontSize: 12,
                        color: "var(--tertiary-text-color)",
                        marginRight: "5px",
                        "&:hover": {
                          textDecoration: "underline",
                          textDecorationColor: "var(--tertiary-text-color)",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {comment.owner.username}
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          )}
        </>
      ) : null}

      {comment.depth < 5 &&
      comment.hasChildren &&
      comment.hasChildren - comment.replies.length > 0 ? (
        <>
          {!isLoading ? (
            <div
              onClick={() => mutate()}
              css={{
                maxWidth: "130px",
                width: "fit-content",
                margin: "3px 0 0 12px",
                display: "flex",
                alignItems: "center",
                color: "#01579b",
                ":hover": {
                  cursor: "pointer",
                  textDecorationColor: "#01579b",
                  textDecoration: "underline",
                },
              }}
            >
              <span
                css={css`
                  ${elipsisText};
                  color: inherit;
                  text-decoration-color: inherit;
                  font-size: 12px;
                  font-weight: 700;
                `}
              >
                {comment.hasChildren - comment.replies.length === 1
                  ? "1 more reply"
                  : `${comment.hasChildren -
                      comment.replies.length} more replies`}
              </span>
            </div>
          ) : (
            Array(comment.hasChildren - comment.replies.length)
              .fill(null)
              .map((_, index) => (
                <div
                  css={{
                    marginLeft: "2px",
                    marginBottom: "5px",
                    [mQ("mobile")]: {
                      marginBottom: "0px",
                    },
                  }}
                  key={index}
                >
                  <CommentLoader />
                </div>
              ))
          )}
        </>
      ) : null}
    </div>
  );
};
