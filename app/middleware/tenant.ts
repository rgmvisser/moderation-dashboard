import type { Role } from "@prisma/client";
import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { ModeratorController } from "~/controllers/moderator.server";
import { DashboardPath } from "~/shared/utils.tsx/navigation";
import { GetAuthenticatedModerator } from "./authenticate";
import { HasRole } from "../models/roles";

export async function GetTenant(
  request: Request,
  params: Params,
  requiredRole?: Role
) {
  const { tenant } = await GetModeratorAndTenant(request, params, requiredRole);
  return tenant;
}

export async function GetModeratorAndTenant(
  request: Request,
  params: Params,
  requiredRole?: Role
) {
  const tenantSlug = params.tenantSlug;
  const authedModerator = await GetAuthenticatedModerator(request);
  const tenants = await ModeratorController.GetTenantsForModerator(
    authedModerator
  );
  const tenant = tenants.find((t) => t.slug === tenantSlug);
  if (!tenant) {
    throw redirect(DashboardPath());
  }
  const moderatorController = new ModeratorController(tenant);
  const moderator = await moderatorController.getModeratorWithTenantAndRole(
    authedModerator.id
  );
  if (!moderator) {
    throw redirect(DashboardPath());
  }
  if (requiredRole) {
    if (!HasRole(tenant, moderator, requiredRole)) {
      throw redirect(DashboardPath());
    }
  }
  return { tenant, moderator };
}
