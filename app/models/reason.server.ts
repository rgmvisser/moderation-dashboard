import type { Reason, Status, Tenant } from "@prisma/client";
import { getTenantClient } from "~/db.server";

export type ReasonsForStatus = Record<Status, Reason[]>;

export async function GetStatusReasons(tetant: Tenant) {
  const statusReasons = await getTenantClient(tetant).statusReasons.findMany({
    include: {
      reason: true,
    },
  });
  const reasons: ReasonsForStatus = {
    allowed: [],
    flagged: [],
    hidden: [],
  };
  for (const statusReason of statusReasons) {
    reasons[statusReason.status].push(statusReason.reason);
  }
  return reasons;
}
