import type { Tenant } from "@prisma/client";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { ReasonsForStatus } from "~/models/reason";

type TenantContext = {
  tenant: Tenant;
  reasons: ReasonsForStatus;
};

const defaultState: TenantContext = {
  tenant: {} as Tenant,
  reasons: {
    allowed: [],
    flagged: [],
    hidden: [],
  },
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
