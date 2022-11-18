import type { Message, Status, User } from "@prisma/client";
import type { ReactNode } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

type ModalContexState = {
  opened: boolean;
  message?: Message;
  user?: User;
  status: Status;
};

type ModalContex = {
  setOpened: (
    opened: boolean,
    status: Status,
    message?: Message,
    user?: User
  ) => void;
  closeModal: () => void;
} & ModalContexState;

const defaultState: ModalContexState = {
  opened: false,
  status: "allowed",
  message: undefined,
  user: undefined,
};

const modalContex = createContext<ModalContex>({
  ...defaultState,
  setOpened: (opened, status, message, user) => {},
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
    message?: Message,
    user?: User
  ) {
    setState({ opened, status, message, user });
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
