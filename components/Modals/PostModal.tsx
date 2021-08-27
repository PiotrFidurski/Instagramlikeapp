import { mQ } from "@styled";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import PostPage from "pages/posts/[postId]/index";
import * as React from "react";
import { ModalBase } from "./ModalComposition";

interface Props {}

export const PostModal: React.FC<Props> = () => {
  const [session] = useSession();

  const router = useRouter();

  return (
    <ModalBase
      onCloseCallback={async () => {
        router.back();
      }}
      isOpen={!!router.query.postId}
    >
      <ModalBase.Header title="Photo" onArrowClick={() => router.back()} />
      <div
        css={{
          height: "600px",
          position: "relative",
          [mQ("mobile")]: { height: "auto" },
        }}
      >
        <PostPage isModal={true} session={session!} />
      </div>
    </ModalBase>
  );
};
