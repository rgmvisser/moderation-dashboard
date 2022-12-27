import cuid from "cuid";
import type { Condition, Rule } from "@prisma/client";

export type PartialCondition = Omit<Condition, "createdAt" | "updatedAt">;

export const NewCondition = (
  rule: Rule,
  tenantId: string
): PartialCondition => {
  return {
    id: cuid(),
    ruleId: rule.id,
    tenantId: tenantId,
  };
};
