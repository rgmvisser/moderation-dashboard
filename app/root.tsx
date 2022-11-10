import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import tailwindStylesheetUrl from "./styles/tailwind.css";
// import { getUser } from "./session.server";
import AppLayout from "./shared/components/AppLayout";
import { SocketProvider } from "./shared/contexts/SocketContext";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Moderation Prototype",
  viewport: "width=device-width,initial-scale=1",
});

createEmotionCache({ key: "mantine" });

export async function loader({ request }: LoaderArgs) {
  return json({
    // user: await getUser(request),
  });
}

export default function App() {
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

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en" className="h-full">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body className="h-full">
          <SocketProvider socket={socket}>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </SocketProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}
