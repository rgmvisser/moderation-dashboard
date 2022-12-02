import classNames from "classnames";
import type { ReactNode } from "react";

export const EmptyStateTable = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        "flex h-32 items-center justify-center text-center text-secondary",
        className
      )}
    >
      {children}
    </div>
  );
};
