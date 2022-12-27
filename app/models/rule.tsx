import type { Condition, Rule, Reason } from "@prisma/client";

export type RuleWithReasonAndCondions = Rule & {
  reason: Reason;
  conditions: Condition[];
};
