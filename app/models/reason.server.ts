import type { Reason, Status } from "@prisma/client";
import { db } from "~/db.server";

export type ReasonsForStatus = Record<Status, Reason[]>;

export async function GetStatusReasons() {
  const statusReasons = await db.statusReasons.findMany({
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
