import classNames from "classnames";
import type { ReactNode } from "react";

export const DashboardContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        "flex flex-1 flex-col items-stretch justify-start rounded-lg border border-main bg-white",
        className
      )}
    >
      {children}
    </div>
  );
};
