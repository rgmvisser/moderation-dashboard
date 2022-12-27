import type { RuleType } from "@prisma/client";
import type { MoveDirection, RuleWithReasonAndCondions } from "~/models/rule";
import { BaseTenantController } from "./baseController.server";

export class RulesController extends BaseTenantController {
  order = {
    order: "asc",
  } as const;

  async getRules(type: RuleType): Promise<RuleWithReasonAndCondions[]> {
    return await this.db.rule.findMany({
      where: {
        type,
      },
      include: {
        reason: true,
        conditions: true,
      },
      orderBy: this.order,
    });
  }

  async getRule(ruleId: string): Promise<RuleWithReasonAndCondions> {
    const rule = await this.db.rule.findUnique({
      where: {
        id: ruleId,
      },
      include: {
        reason: true,
        conditions: true,
      },
    });
    if (!rule) {
      throw new Error("Rule not found");
    }
    return rule;
  }

  async moveRule(ruleId: string, direction: MoveDirection) {
    const rule = await this.getRule(ruleId);

    const rules = await this.db.rule.findMany({
      where: {
        type: rule.type,
      },
      orderBy: this.order,
    });

    const ruleIndex = rules.findIndex((r) => r.id === ruleId);

    if (ruleIndex === -1) {
      throw new Error("Rule not found");
    }

    let newRuleIndex = ruleIndex;

    if (direction === "up") {
      newRuleIndex = ruleIndex - 1;
    } else if (direction === "down") {
      newRuleIndex = ruleIndex + 1;
    }

    if (newRuleIndex < 0 || newRuleIndex >= rules.length) {
      throw new Error("Rule cannot be moved");
    }

    const newRule = rules[newRuleIndex];

    await this.db.$transaction(async (tx) => {
      await tx.rule.update({
        where: {
          id: ruleId,
        },
        data: {
          order: newRule.order,
        },
      });
      await tx.rule.update({
        where: {
          id: newRule.id,
        },
        data: {
          order: rule.order,
        },
      });
    });
  }
}
