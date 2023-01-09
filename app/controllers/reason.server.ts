import type { Status } from "@prisma/client";
import type { ReasonsForStatus } from "~/models/reason";
import { BaseTenantController } from "./baseController.server";

export class ReasonController extends BaseTenantController {
  async getStatusReasons() {
    const reasons = await this.getReasons();

    const reasonsForStatus: ReasonsForStatus = {
      allowed: [],
      flagged: [],
      hidden: [],
    };
    for (const reason of reasons) {
      for (const status of reason.statuses) {
        reasonsForStatus[status].push(reason);
      }
    }
    return reasonsForStatus;
  }

  async getReasons() {
    return this.db.reason.findMany();
  }

  async findOrCreateReason(reasonIdOrName: string, action: Status) {
    return this.db.$transaction(async (tx) => {
      const existingReason = await tx.reason.findFirst({
        where: {
          id: reasonIdOrName,
        },
      });
      if (existingReason) {
        if (existingReason.statuses.includes(action)) {
          return existingReason;
        }
        return await tx.reason.update({
          where: {
            id: existingReason.id,
          },
          data: {
            statuses: {
              push: action,
            },
          },
        });
      }
      return await tx.reason.create({
        data: {
          name: reasonIdOrName,
          tenantId: this.tenant.id,
          statuses: [action],
          custom: true,
        },
      });
    });
  }

  async findFirstReason(action: Status) {
    return this.db.reason.findFirst({
      where: {
        statuses: {
          has: action,
        },
      },
    });
  }
}
