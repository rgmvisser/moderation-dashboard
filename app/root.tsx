import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "remix-supertyped";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import AppLayout from "./shared/components/AppLayout";
import { SocketProvider } from "./shared/contexts/SocketContext";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import { intervalTimer } from "./controllers.ts/timer.server";
import { AppProvider } from "./shared/contexts/AppContext";
import { ActionModal } from "./shared/components/ActionModal";
import { ModalProvider } from "./shared/contexts/ModalContext";
import { GetStatusReasons } from "./models/reason.server";
import { GetAdmin } from "./models/admin.server";

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
  const reasons = await GetStatusReasons();
  return json({
    timer: {
      enabled: intervalTimer.enabled,
      speed: intervalTimer.speed,
    },
    reasons: reasons,
    admin: await GetAdmin(),
    // user: await getUser(request),
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
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
          <AppProvider
            timer={data.timer}
            reasons={data.reasons}
            admin={data.admin ?? undefined}
          >
            <SocketProvider socket={socket}>
              <ModalProvider>
                <AppLayout>
                  <Outlet />
                  <ActionModal />
                </AppLayout>
              </ModalProvider>
            </SocketProvider>
          </AppProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en" className="h-full">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body className="h-full">
          <AppLayout>
            <div>
              <h1>Oops that's an error!</h1>
              <h2>
                {caught.status} {caught.statusText}
              </h2>
            </div>
            <ActionModal />
          </AppLayout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}
