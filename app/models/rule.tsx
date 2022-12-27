import type { Condition, Rule, Reason } from "@prisma/client";

export type RuleWithReasonAndCondions = Rule & {
  reason: Reason;
  conditions: Condition[];
};

export type MoveDirection = "up" | "down";

export const Directions = ["up", "down"] as const;
