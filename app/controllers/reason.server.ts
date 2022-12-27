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
}
