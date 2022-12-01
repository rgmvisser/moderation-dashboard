import type { LoaderArgs } from "@remix-run/node";
import { json, useLoaderData } from "remix-supertyped";
import { Outlet } from "@remix-run/react";

import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import { GetTenant } from "~/middleware/tenant";
import { TenantProvider } from "~/shared/contexts/TenantContext";
import AppLayout from "~/shared/components/AppLayout";
import { SocketProvider } from "~/shared/contexts/SocketContext";
import { ModalProvider } from "~/shared/contexts/ModalContext";
import { ActionModal } from "~/shared/components/ActionModal";
import { ReasonController } from "~/controllers/reason.server";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const reasonController = new ReasonController(tenant);
  const reasons = await reasonController.getStatusReasons();
  return json({
    tenant: tenant,
    reasons: reasons,
  });
}

export default function Tenant() {
  const data = useLoaderData<typeof loader>();

  return (
    <TenantProvider {...data}>
      <SocketProvider>
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
