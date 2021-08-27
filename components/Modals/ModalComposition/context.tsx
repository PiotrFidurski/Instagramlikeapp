import * as React from "react";
import { ModalRoot } from "./ModalRoot";

interface Modal {
  key: string;
  open: boolean;
  props: any;
}

interface ModalContextProps {
  modal: Modal;
  setModal: React.Dispatch<React.SetStateAction<Modal>>;
}

const ModalContext = React.createContext<ModalContextProps | null>(null);

export const ModalProvider: React.FC<any> = ({ children }) => {
  const [modal, setModal] = React.useState<Modal>({
    open: false,
    key: "",
    props: {},
  });

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      <ModalRoot />
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext!);

  if (!context)
    throw new Error(
      "You are using Modal outside of ModalProvider, try wrapping your parent component in <ModalProvider> compoment"
    );

  return context;
};
