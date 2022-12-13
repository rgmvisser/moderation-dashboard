import type { Reason, Tenant } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { LabelCategory } from "~/models/asw-labels";
import type { ReasonsForStatus } from "~/models/reason";

export type TenantContext = {
  tenant: Tenant;
  reasons: ReasonsForStatus;
  reasonForCategories: Record<LabelCategory, Reason>;
};

const defaultState: TenantContext = {
  tenant: {} as Tenant,
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
