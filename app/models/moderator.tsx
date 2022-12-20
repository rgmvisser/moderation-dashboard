import type { Moderator, ModeratorRole, Tenant } from "@prisma/client";
import { Role } from "@prisma/client";

export const Roles = Object.keys(Role) as Role[];

export type ModeratorWithTentantAndRole = Moderator & {
  roles: (ModeratorRole & {
    tenant: Tenant;
  })[];
};
