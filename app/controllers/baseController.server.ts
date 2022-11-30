import type { PrismaClient, Tenant } from "@prisma/client";
import { getTenantClient } from "~/db.server";

export class BaseTenantController {
  tenant: Tenant;
  db: PrismaClient;

  constructor(tenant: Tenant) {
    this.tenant = tenant;
    this.db = getTenantClient(tenant);
  }
}
