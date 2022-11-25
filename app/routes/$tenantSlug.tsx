import type { LoaderArgs } from "@remix-run/node";
import { json, useLoaderData } from "remix-supertyped";
import { Outlet, useCatch, useNavigate } from "@remix-run/react";

import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import { GetTenant } from "~/middleware/tenant";
import { TenantProvider } from "~/shared/contexts/TenantContext";
import AppLayout from "~/shared/components/AppLayout";
import { GetStatusReasons } from "~/models/reason.server";
import { SocketProvider } from "~/shared/contexts/SocketContext";
import { ModalProvider } from "~/shared/contexts/ModalContext";
import { ActionModal } from "~/shared/components/ActionModal";
import { CMError } from "~/models/error";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(params);
  const reasons = await GetStatusReasons(tenant);
  return json({
    tenantSlug: tenant.slug,
    reasons: reasons,
  });
}

export default function Tenant() {
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
    <TenantProvider {...data}>
      <SocketProvider socket={socket}>
        <ModalProvider>
          <AppLayout>
            <Outlet />
            <ActionModal />
          </AppLayout>
        </ModalProvider>
      </SocketProvider>
    </TenantProvider>
  );
}
