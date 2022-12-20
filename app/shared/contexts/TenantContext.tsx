import type { Role } from "@prisma/client";
import type { Reason, Tenant } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { LabelCategory } from "~/models/asw-labels";
import type { ReasonsForStatus } from "~/models/reason";
import type { ModeratorWithTentantAndRole } from "~/models/moderator";
import { Roles } from "~/models/moderator";

export type TenantContext = {
  tenant: Tenant;
  moderator: ModeratorWithTentantAndRole;
  reasons: ReasonsForStatus;
  reasonForCategories: Record<LabelCategory, Reason>;
};

const defaultState: TenantContext = {
  tenant: {} as Tenant,
  moderator: {} as ModeratorWithTentantAndRole,
  reasons: {
    allowed: [],
    flagged: [],
    hidden: [],
  },
  reasonForCategories: {},
};

const tenantContext = createContext<TenantContext>(defaultState);
export const useTenantContext = () => useContext(tenantContext);

type Props = {
  children: ReactNode;
} & TenantContext;

export const TenantProvider = ({ children, ...rest }: Props) => {
  return (
    <tenantContext.Provider value={{ ...rest }}>
      {children}
    </tenantContext.Provider>
  );
};
