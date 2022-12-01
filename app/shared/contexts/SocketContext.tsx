import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

type ProviderProps = {
  children: ReactNode;
};

const context = createContext<Socket | undefined>(undefined);

export function useSocket() {
  return useContext(context);
}

export function SocketProvider({ children }: ProviderProps) {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("confirmation", (data: any) => {
      console.log(data);
    });
  }, [socket]);
  return <context.Provider value={socket}>{children}</context.Provider>;
}
