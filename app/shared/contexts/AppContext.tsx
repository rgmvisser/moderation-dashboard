import type { Moderator } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

type AppContext = {
  timer: {
    enabled: boolean;
    speed: number;
  };

  moderator?: Moderator;
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

export const AppProvider = ({ children, timer, moderator }: Props) => {
  return (
    <appContext.Provider value={{ timer, moderator }}>
      {children}
    </appContext.Provider>
  );
};
