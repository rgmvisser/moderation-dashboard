import type { RuleType, Status } from "@prisma/client";
import { l } from "vitest/dist/index-220c1d70";
import type { MoveDirection, RuleWithReasonAndCondions } from "~/models/rule";
import { BaseTenantController } from "./baseController.server";
import { ReasonController } from "./reason.server";

export class RulesController extends BaseTenantController {
  order = {
    order: "asc",
  } as const;
  include = {
    reason: true,
    conditions: true,
  };

  async getRules(type: RuleType): Promise<RuleWithReasonAndCondions[]> {
    return await this.db.rule.findMany({
      where: {
        type,
      },
      include: this.include,
      orderBy: this.order,
    });
  }

  async getRule(ruleId: string): Promise<RuleWithReasonAndCondions> {
    const rule = await this.db.rule.findUnique({
      where: {
        id: ruleId,
      },
      include: this.include,
    });
    if (!rule) {
      throw new Error("Rule not found");
    }
    return rule;
  }

  async createRule(
    name: string,
    type: RuleType,
    action: Status
  ): Promise<RuleWithReasonAndCondions> {
    const rule = await this.db.rule.findFirst({
      where: {
        type,
      },
      orderBy: {
        order: "desc",
      },
    });
    const order = rule ? rule.order + 1 : 0;
    const reasonController = new ReasonController(this.tenant);
    const reason = await reasonController.findFirstReason(action);
    if (!reason) {
      throw new Error("No reason found for action:" + action);
    }
    return await this.db.rule.create({
      data: {
        tenantId: this.tenant.id,
        name,
        type,
        order,
        action,
        reasonId: reason.id,
        terminateOnMatch: true,
        skipIfAlreadyApplied: true,
      },
      include: this.include,
    });
  }

  async updateRule(
    ruleId: string,
    name: string,
    action: Status,
    reasonIdOrName: string,
    terminateOnMatch: boolean,
    skipIfAlreadyApplied: boolean,
    conditions: string[]
  ): Promise<RuleWithReasonAndCondions> {
    const reasonController = new ReasonController(this.tenant);
    const reason = await reasonController.findOrCreateReason(
      reasonIdOrName,
      action
    );
    return await this.db.rule.update({
      where: {
        id: ruleId,
      },
      data: {
        name,
        action,
        reasonId: reason.id,
        terminateOnMatch,
        skipIfAlreadyApplied,
      },
      include: this.include,
    });
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

  async deleteRule(ruleId: string) {
    return await this.db.rule.delete({
      where: {
        id: ruleId,
      },
    });
  }
}
