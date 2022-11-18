import { Admin } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { ReasonsForStatus } from "~/models/reason.server";

type AppContext = {
  timer: {
    enabled: boolean;
    speed: number;
  };
  reasons: ReasonsForStatus;
  admin?: Admin;
};

const defaultState: AppContext = {
  timer: {
    enabled: true,
    speed: 1,
  },
  reasons: {
    allowed: [],
    flagged: [],
    hidden: [],
  },
};

const appContext = createContext<AppContext>(defaultState);
export const useAppContext = () => useContext(appContext);

type Props = {
  children: ReactNode;
} & AppContext;

export const AppProvider = ({ children, timer, reasons, admin }: Props) => {
  return (
    <appContext.Provider value={{ timer, reasons, admin }}>
      {children}
    </appContext.Provider>
  );
};
