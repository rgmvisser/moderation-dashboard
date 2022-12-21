import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "remix-supertyped";
import { GetTenant } from "~/middleware/tenant";

import { ContentRulesPath } from "~/shared/utils.tsx/navigation";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const url = new URL(request.url);
  const path = url.pathname;
  if (path.endsWith("/rules")) {
    return redirect(ContentRulesPath(tenant.slug));
  }
  return null;
}

export default function Rules() {
  return <Outlet />;
}
