import { api } from "@api/index";
import { useAlert } from "@components/Alerts/AlertComposition/context";
import { LoadingBar } from "@components/LoadingBar";
import { PostType } from "@models/Post";
import { Button, mQ } from "@styled";
import * as React from "react";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginatedResult } from "utils/types";
import { ModalBase } from "./ModalComposition";
import { useModal } from "./ModalComposition/context";

interface Props {}

export const DeletePostModal: React.FC<Props> = () => {
  const {
    setModal,
    modal: { props },
  } = useModal();

  const queryClient = useQueryClient();

  const { createAlert } = useAlert();

  const { post } = props;

  const { mutate, isLoading, status } = useMutation(
    ["delete", post._id],
    () => api.posts.delete({ postId: post?._id! }),
    {
      onSuccess: () => {
        queryClient.setQueryData(
          "userFeed",
          (old: InfiniteData<PaginatedResult<PostType>> | undefined) => ({
            ...old!,
            pages: old!.pages?.map((page) => ({
              ...page!,
              pages: page!.pages?.filter((p) => p._id !== post._id),
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
        }, 500);
        createAlert("delete", { timeout: 5000, value: "post" });
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
        title="Delete Post?"
      ></ModalBase.Header>
      <LoadingBar isLoading={isLoading} status={status} />
      <ModalBase.Content>
        <div
          css={{
            maxWidth: "400px",
            height: "145px",
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
            Are you sure u want to delete this post? All of the comments
            associated with this post will also be removed.
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
