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
        className,
        "flex flex-1 flex-col items-start justify-start rounded-lg border border-main bg-white"
      )}
    >
      {children}
    </div>
  );
};
