import type { Reason, Status, User } from "@prisma/client";
import type { ReactNode } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { MessageOrImage } from "~/models/content";

type ActionModalContexState = {
  opened: boolean;
  data: {
    status: Status;
    content?: MessageOrImage;
    user?: User;
    reason?: Reason;
    otherInformation?: string;
  };
};

type ActionModalContex = {
  setOpened: (
    opened: boolean,
    data: {
      status: Status;
      reason?: Reason;
      otherInformation?: string;
      content?: MessageOrImage;
      user?: User;
    }
  ) => void;
  closeModal: () => void;
} & ActionModalContexState;

const defaultState: ActionModalContexState = {
  opened: false,
  data: {
    status: "allowed",
  },
};

const actionModalContex = createContext<ActionModalContex>({
  ...defaultState,
  setOpened: (opened, data) => {},
  closeModal: () => {},
});
export const useActionModalContex = () => useContext(actionModalContex);

type Props = {
  children: ReactNode;
};

export const ActionModelProvider = ({ children }: Props) => {
  const [state, setState] = useState(defaultState);

  function setOpened(
    opened: boolean,
    data: {
      status: Status;
      reason?: Reason;
      otherInformation?: string;
      content?: MessageOrImage;
      user?: User;
    }
  ) {
    setState({ opened, data });
  }

  function closeModal() {
    setState({ ...state, opened: false });
  }

  return (
    <actionModalContex.Provider value={{ ...state, setOpened, closeModal }}>
      {children}
    </actionModalContex.Provider>
  );
};
