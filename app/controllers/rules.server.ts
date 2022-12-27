import type { RuleType } from "@prisma/client";
import type { RuleWithReasonAndCondions } from "~/models/rule";
import { BaseTenantController } from "./baseController.server";

export class RulesController extends BaseTenantController {
  async getRules(type: RuleType): Promise<RuleWithReasonAndCondions[]> {
    return await this.db.rule.findMany({
      where: {
        type,
      },
      include: {
        reason: true,
        conditions: true,
      },
    });
  }
}
