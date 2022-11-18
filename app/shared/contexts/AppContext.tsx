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

export const AppProvider = ({ children, timer, reasons }: Props) => {
  return (
    <appContext.Provider value={{ timer, reasons }}>
      {children}
    </appContext.Provider>
  );
};
