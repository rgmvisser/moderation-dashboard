import type { Content, Status, User } from "@prisma/client";
import type { ReactNode } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

type ModalContexState = {
  opened: boolean;
  content?: Content;
  user?: User;
  status: Status;
};

type ModalContex = {
  setOpened: (
    opened: boolean,
    status: Status,
    content?: Content,
    user?: User
  ) => void;
  closeModal: () => void;
} & ModalContexState;

const defaultState: ModalContexState = {
  opened: false,
  status: "allowed",
  content: undefined,
  user: undefined,
};

const modalContex = createContext<ModalContex>({
  ...defaultState,
  setOpened: (opened, status, content, user) => {},
  closeModal: () => {},
});
export const useModalContex = () => useContext(modalContex);

type Props = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: Props) => {
  const [state, setState] = useState(defaultState);

  function setOpened(
    opened: boolean,
    status: Status,
    content?: Content,
    user?: User
  ) {
    setState({ opened, status, content, user });
  }

  function closeModal() {
    setState({ ...state, opened: false });
  }

  return (
    <modalContex.Provider value={{ ...state, setOpened, closeModal }}>
      {children}
    </modalContex.Provider>
  );
};
