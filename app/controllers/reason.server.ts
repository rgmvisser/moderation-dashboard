import type { ReasonsForStatus } from "~/models/reason";
import { BaseTenantController } from "./baseController.server";

export class ReasonController extends BaseTenantController {
  async getStatusReasons() {
    const statusReasons = await this.db.statusReason.findMany({
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

  async getReasons() {
    return this.db.reason.findMany();
  }
}
