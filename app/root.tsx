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

import { intervalTimer } from "./controllers.ts/timer.server";
import { AppProvider } from "./shared/contexts/AppContext";
import { ActionModal } from "./shared/components/ActionModal";
import { ModeratorController } from "./controllers.ts/moderator.server";
import { getGeneralClient } from "./db.server";

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
  // TODO: load tenant in another way
  const tenant = await getGeneralClient().tenant.findFirstOrThrow();
  const tenantUserController = new ModeratorController(tenant);
  return json({
    timer: {
      enabled: intervalTimer.enabled,
      speed: intervalTimer.speed,
    },
    moderator: await tenantUserController.getModerator(),
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en" className="h-full">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body className="h-full bg-slate-50">
          <AppProvider {...data}>
            <Outlet />
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
