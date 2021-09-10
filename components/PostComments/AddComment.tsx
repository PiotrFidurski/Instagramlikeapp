import { api } from "@api/index";
import { Send } from "@assets/svgs/index";
import { CommentType } from "@models/Comment";
import { AvatarWrapper, Button, mQ } from "@styled";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useSession } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { Reply } from "pages/posts/[postId]/thread/[threadId]";
import * as React from "react";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { createSchema } from "schemaValidators/comment";
import { addNested } from "utils/fns";
import { useAutosize } from "utils/hooks/useAutosize";
import { PaginatedResult } from "utils/types";

interface Values {
  inReplyToCommentId?: string;
  inReplyToUsername?: string;
  text: string;
  postId: string;
  prevDepth?: number;
}

interface Props {
  reply: {
    inReplyToCommentId?: string;
    inReplyToUsername?: string;
    prevDepth?: number;
  };
  setReply: React.Dispatch<React.SetStateAction<Reply>>;
}

export const AddComment: React.FC<Props> = ({ reply, setReply }) => {
  const router = useRouter();

  const [session] = useSession();

  const textAreaRef = useAutosize();

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (reply.inReplyToUsername !== "") {
      textAreaRef?.current?.focus();
    } else {
      textAreaRef!.current!.style.height = "auto";
    }
  }, [reply]);

  const { mutate } = useMutation(
    "add_comment",
    (values: Values) => api.comments.create({ ...values }),
    {
      onSuccess: (data: CommentType) => {
        if (!data.inReplyToCommentId) {
          queryClient.setQueryData(
            ["comments", router.query.postId, router.query.threadId],
            (old: InfiniteData<PaginatedResult<CommentType>> | undefined) => ({
              ...old!,
              pages: [
                ...old!.pages.map((page: any, index: number) => {
                  if (index === 0) {
                    return {
                      ...page,
                      pages: [data, ...page.pages],
                    };
                  }
                  return page;
                }),
              ],
            })
          );
        } else {
          queryClient.setQueryData(
            ["comments", router.query.postId, router.query.threadId],
            (old: InfiniteData<PaginatedResult<CommentType>> | undefined) => ({
              ...old!,
              pages: [
                ...old!.pages!.map((page: any) => {
                  return {
                    ...page,
                    pages: page.pages.filter((comment: any) => {
                      if (comment._id === data.inReplyToCommentId) {
                        comment.replies.unshift(data);
                        comment.hasChildren = comment.hasChildren + 1;
                      } else {
                        addNested(comment, data);
                      }

                      return comment;
                    }),
                  };
                }),
              ],
            })
          );
        }
      },
    }
  );

  const handleSubmit = ({
    ...props
  }: FormikHelpers<{ text: string }> & { text: string }) => {
    const { text, setErrors, resetForm } = props;

    mutate(
      {
        text,
        postId: router.query.postId as string,
        prevDepth: reply.prevDepth,
        inReplyToCommentId: reply.inReplyToCommentId,
        inReplyToUsername: reply.inReplyToUsername,
      },
      {
        onSuccess: () => {
          resetForm();
          setReply({
            inReplyToCommentId: "",
            inReplyToUsername: "",
            prevDepth: 0,
            text: "",
          });
        },
        onError: (errors) => {
          setErrors(errors as FormikErrors<{ text: string }>);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={{
        text: "",
      }}
      validationSchema={createSchema}
      onSubmit={(values, props) => handleSubmit({ ...values, ...props })}
    >
      {({ touched, errors, ...props }) => (
        <form onSubmit={props.handleSubmit}>
          <div
            css={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              padding: "3px 0",
            }}
          >
            <span css={{ color: "#b71c1c" }}>
              {errors.text ? errors.text : null}
            </span>
          </div>
          <div
            css={{
              display: "flex",
              padding: "10px 17px",
              flexGrow: 1,
              alignItems: "center",
              [mQ("mobile")]: {
                borderBottom: "1px solid var(--border-color)",
              },
            }}
          >
            <div css={{ marginRight: "5px" }}>
              <AvatarWrapper width="35px" height="35px">
                <Image
                  src={session?.user?.image!}
                  alt="userAvatar"
                  objectFit="contain"
                  width="150px"
                  height="150px"
                  layout="responsive"
                />
              </AvatarWrapper>
            </div>
            <div css={{ display: "flex", flexGrow: 1 }}>
              <textarea
                value={props.values.text}
                onChange={props.handleChange}
                name="text"
                ref={textAreaRef}
                rows={1}
                placeholder="Add a comment..."
                autoComplete="false"
                css={{
                  lineHeight: "18px",
                  fontSize: 12,
                  maxHeight: "85px",
                  font: "inherit",
                  overflow: "auto",
                  color: "var(--primary-text-color)",
                  outline: "none",
                  flexGrow: 1,
                  background: "var(--container-background)",
                  "::placeholder": { color: "var(--tertiary-text-color)" },
                  border: 0,
                  resize: "none",
                }}
              />
            </div>
            <div css={{ display: "flex" }}>
              <Button
                disabled={!props.values.text || !!errors.text}
                type="submit"
                active
                css={{ padding: "8px 8px", marginLeft: "5px" }}
              >
                <Send width="20" height="20" fill="white" />
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
