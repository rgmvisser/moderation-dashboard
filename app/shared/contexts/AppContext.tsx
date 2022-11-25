import type { Admin } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

type AppContext = {
  timer: {
    enabled: boolean;
    speed: number;
  };

  admin?: Admin;
};

const defaultState: AppContext = {
  timer: {
    enabled: true,
    speed: 1,
  },
};

const appContext = createContext<AppContext>(defaultState);
export const useAppContext = () => useContext(appContext);

type Props = {
  children: ReactNode;
} & AppContext;

export const AppProvider = ({ children, timer, admin }: Props) => {
  return (
    <appContext.Provider value={{ timer, admin }}>
      {children}
    </appContext.Provider>
  );
};
