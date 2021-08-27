import { api } from "@api/index";
import { useAlert } from "@components/Alerts/AlertComposition/context";
import { LoadingBar } from "@components/LoadingBar";
import { CommentType } from "@models/Comment";
import { Button, mQ } from "@styled";
import * as React from "react";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginatedResult } from "utils/types";
import { ModalBase } from "./ModalComposition";
import { useModal } from "./ModalComposition/context";

interface Props {}

export const DeleteCommentModal: React.FC<Props> = () => {
  const {
    setModal,
    modal: { props },
  } = useModal();

  const queryClient = useQueryClient();

  const { createAlert } = useAlert();

  const { comment, queryKeys } = props;

  const { mutate, isLoading, status } = useMutation(
    ["delete", comment._id],
    () => api.comments.delete({ commentId: comment?._id! }),
    {
      onSuccess: (data: CommentType) => {
        const deleteNested = (c: CommentType) => {
          if (!c.replies) return c;
          c.replies.map((reply) => {
            if (reply.hasChildren > 0 && reply._id === comment._id) {
              reply.owner.username = "User has deleted this comment.";
              reply.owner.image = data.owner.image;
              reply.text = "";
              reply.isTombstone = data.isTombstone;
            }
            if (reply.hasChildren === 0 && reply._id === comment._id) {
              c.hasChildren = c.hasChildren - 1;
            }
            deleteNested(reply);
          });
        };

        queryClient.setQueryData(
          ["comments", ...queryKeys],
          (old: InfiniteData<PaginatedResult<CommentType>> | undefined) => ({
            ...old!,
            pages: old!.pages!.map((page) => ({
              ...page!,
              pages: page!.pages!.filter((reply) => {
                if (reply.hasChildren > 0 && reply._id === comment._id) {
                  reply.owner.username = "User has deleted this comment.";
                  reply.owner.image = data.owner.image;
                  reply.text = "";
                  reply.isTombstone = data.isTombstone;
                  return reply;
                }
                if (reply.hasChildren === 0 && reply._id === comment._id) {
                  return reply._id !== comment._id;
                }

                deleteNested(reply);
                return reply;
              }),
            })),
          })
        );
        setTimeout(() => {
          setModal((modal) => ({
            ...modal,
            key: "",
            open: false,
            props: {},
          }));
          createAlert("delete", {
            timeout: 5000,
            value: "comment",
          });
        }, 500);
      },
    }
  );

  return (
    <ModalBase onCloseCallback={async () => {}}>
      <ModalBase.Header
        visibleOnLarge={true}
        onArrowClick={() =>
          setModal((modal) => ({ ...modal, key: "", open: false, props: {} }))
        }
        title="Delete Comment?"
      ></ModalBase.Header>
      <LoadingBar isLoading={isLoading} status={status} />
      <ModalBase.Content>
        <div
          css={{
            maxWidth: "400px",
            height: "auto",
            width: "100%",
            wordBreak: "break-word",
            margin: "0 auto",
            alignItems: "center",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            [mQ("mobile")]: {
              height: "100vh",
            },
          }}
        >
          <span
            css={{
              color: "var(--primary-text-color)",
              fontSize: "16",
              fontWeight: 700,
            }}
          >
            Are you sure u want to delete this comment? If it has any replies
            people won't be able to see your comment anymore. If your comment
            has no replies it will be pernamently removed.
          </span>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "400px",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <div css={{ maxWidth: "140px", width: "100%" }}>
              <Button
                active={true}
                css={{ width: "100%" }}
                onClick={() => mutate()}
              >
                <span>Delete</span>
              </Button>
            </div>
            <div css={{ maxWidth: "140px", width: "100%" }}>
              <Button
                active={false}
                css={{ width: "100%" }}
                onClick={() =>
                  setModal((modal) => ({
                    ...modal,
                    key: "",
                    open: false,
                    props: {},
                  }))
                }
              >
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      </ModalBase.Content>
    </ModalBase>
  );
};
