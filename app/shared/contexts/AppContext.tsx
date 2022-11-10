import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

type AppContext = {
  timer: {
    enabled: boolean;
    speed: number;
  };
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
  timer: {
    enabled: boolean;
    speed: number;
  };
};

export const AppProvider = ({ children, timer }: Props) => {
  return (
    <appContext.Provider value={{ timer }}>{children}</appContext.Provider>
  );
};
