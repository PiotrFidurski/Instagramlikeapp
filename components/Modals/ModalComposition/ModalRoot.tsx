import * as React from "react";
import { DeleteCommentModal } from "../DeleteCommentModal";
import { DeletePostModal } from "../DeletePostModal";
import { PostModal } from "../PostModal";
import { UpdateUserUsernameModal } from "../UpdateUserUsernameModal";
import { useModal } from "./context";

const Modals: Record<string, React.FunctionComponent<any>> = {
  UPDATE_USER: UpdateUserUsernameModal,
  POST_MODAL: PostModal,
  DELETE_POST: DeletePostModal,
  DELETE_COMMENT: DeleteCommentModal,
};

interface Props {}

export const ModalRoot: React.FC<Props> = ({ ...props }) => {
  const { modal } = useModal();

  const AnyModal = Modals[modal.key];

  if (modal.open && AnyModal) {
    return <AnyModal {...props} />;
  }

  return null;
};
