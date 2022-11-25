import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { ReasonsForStatus } from "~/models/reason";

type TenantContext = {
  tenantSlug: string;
  reasons: ReasonsForStatus;
};

const defaultState: TenantContext = {
  tenantSlug: "",
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

export const TenantProvider = ({ children, reasons, tenantSlug }: Props) => {
  return (
    <tenantContext.Provider value={{ reasons, tenantSlug }}>
      {children}
    </tenantContext.Provider>
  );
};
