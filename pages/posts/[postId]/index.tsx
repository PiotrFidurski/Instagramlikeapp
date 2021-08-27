import { Session } from "next-auth";
import * as React from "react";
import Thread from "./thread/[threadId]";

interface Props {
  isModal?: boolean;
  session: Session | undefined;
}

const PostPage: React.FC<Props> = ({ isModal = false }) => {
  return <Thread isModal={isModal} />;
};

export default PostPage;
