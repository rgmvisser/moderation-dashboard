import type { Tenant } from "@prisma/client";
import { Role } from "@prisma/client";
import { redirect } from "remix-supertyped";
import type { ModeratorWithTentantAndRole } from "~/models/moderator";
import { DashboardPath } from "~/shared/utils.tsx/navigation";

export function HasRole(
  tenant: Tenant,
  moderator: ModeratorWithTentantAndRole,
  role: Role
) {
  if (!tenant || !moderator) {
    return false;
  }
  return (
    moderator.roles.find((r) => r.tenantId === tenant.id)?.role === Role.admin
  );
}

export function IsAdmin(
  tenant: Tenant,
  moderator: ModeratorWithTentantAndRole
) {
  return HasRole(tenant, moderator, Role.admin);
}
