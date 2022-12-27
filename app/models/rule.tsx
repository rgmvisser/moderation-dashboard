import type { Condition, Rule, StatusReason } from "@prisma/client";

export type RuleWithReasonAndCondions = Rule & {
  reason: StatusReason;
  conditions: Condition[];
};
