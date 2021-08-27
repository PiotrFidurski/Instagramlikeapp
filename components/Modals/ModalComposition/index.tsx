import { css } from "@emotion/react";
import * as React from "react";
import Modal from "react-modal";
import { Content, ContentProps } from "./Content";
import { useModal } from "./context";
import { Header, HeaderProps } from "./Header";

const modalStyle = css`
  @media only screen and (max-width: 600px) {
    height: auto !important;
    top: 0px !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }
`;

export const contentStyles = () => {
  return {
    content: {
      maxWidth: "fit-content",
      margin: "0 auto",
      height: "auto",
      color: "var(--primary-text-color)",
      padding: 0,
      position: "relative",
      left: 0,
      top: 100,
      display: "flex",
      flexBasis: "auto",
      flexDirection: "column",
      flexShrink: 1,
      boxSizing: "border-box",
      right: 0,
      bottom: 0,
      outline: "none",
      background: "var(--background-color)",
      borderColor: "var(--border-color)",
      borderRadius: "3px",
    } as any,
    overlay: {
      zIndex: 9999,
      overflow: "auto",
      background: "var(--loading-background-color)",
    },
  };
};

interface Props {
  onCloseCallback: () => Promise<void>;
  isOpen?: boolean;
}

interface ModalComposition {
  Header: React.FC<HeaderProps>;
  Content: React.FC<ContentProps>;
}

export const ModalBase: React.FC<Props> & ModalComposition = ({
  children,
  onCloseCallback,
  isOpen,
}) => {
  const styles = contentStyles();

  const { modal, setModal } = useModal();

  return (
    <Modal
      css={modalStyle}
      isOpen={modal.open || isOpen!}
      style={{ ...styles }}
      onRequestClose={() => {
        setModal((modal) => ({ ...modal, open: false, key: "", props: {} }));
        onCloseCallback();
      }}
      onAfterOpen={() => {
        document.body.style.overflowY = "hidden";
        document.body.style.margin = "0px 17px 0px 0px";
      }}
      onAfterClose={() => {
        document.body.style.overflowY = "unset";
        document.body.style.margin = "0";
      }}
      shouldCloseOnOverlayClick={true}
    >
      {children}
    </Modal>
  );
};

ModalBase.Header = Header;
ModalBase.Content = Content;
