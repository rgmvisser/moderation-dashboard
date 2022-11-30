import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { ModeratorController } from "~/controllers/moderator.server";
import { DashboardPath } from "~/shared/utils.tsx/navigation";
import { GetAuthenticatedModerator } from "./authenticate";

export async function GetTenant(request: Request, params: Params) {
  const { tenant } = await GetModeratorAndTenant(request, params);
  return tenant;
}

export async function GetModeratorAndTenant(request: Request, params: Params) {
  const tenantSlug = params.tenantSlug;
  const moderator = await GetAuthenticatedModerator(request);
  const tenants = await ModeratorController.GetTenantsForModerator(moderator);
  const tenant = tenants.find((t) => t.slug === tenantSlug);
  if (!tenant) {
    throw redirect(DashboardPath());
  }
  return { tenant, moderator };
}
