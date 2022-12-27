import type { LoaderArgs } from "@remix-run/node";
import { json, useLoaderData } from "remix-supertyped";
import { Outlet } from "@remix-run/react";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import type { TenantContext } from "~/shared/contexts/TenantContext";
import { TenantProvider } from "~/shared/contexts/TenantContext";
import AppLayout from "~/shared/components/AppLayout";
import { SocketProvider } from "~/shared/contexts/SocketContext";
import { ActionModelProvider } from "~/shared/contexts/ActionModalContext";
import { ActionModal } from "~/shared/components/ActionModal";
import { ReasonController } from "~/controllers/reason.server";
import { getReasonForCategories } from "~/models/asw-labels";

export async function loader({ request, params }: LoaderArgs) {
  const { tenant, moderator } = await GetModeratorAndTenant(request, params);
  const reasonController = new ReasonController(tenant);
  const statusReasons = await reasonController.getStatusReasons();
  const reasons = await reasonController.getReasons();
  const tenantContext: TenantContext = {
    tenant: tenant,
    moderator: moderator,
    reasons: statusReasons,
    reasonForCategories: getReasonForCategories(reasons),
  };

  return json(tenantContext);
}

export default function Tenant() {
  const data = useLoaderData<typeof loader>();

  return (
    <TenantProvider {...data}>
      <SocketProvider>
        <ActionModelProvider>
          <AppLayout>
            <Outlet />
            <ActionModal />
          </AppLayout>
        </ActionModelProvider>
      </SocketProvider>
    </TenantProvider>
  );
}
