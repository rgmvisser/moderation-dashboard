import type { Status } from "@prisma/client";
import classNames from "classnames";
import type { ReactNode } from "react";
import {
  ButtonColorFromStatus,
  ButtonHoverColorFromStatus,
} from "../utils.tsx/status";

export const CMButton = ({
  children,
  className,
  status,
}: {
  children: ReactNode;
  className?: string;
  status?: Status;
}) => {
  const color = status ? ButtonColorFromStatus(status) : "bg-main";
  const hoverColor = status
    ? ButtonHoverColorFromStatus(status)
    : "bg-main-hover";
  return (
    <button
      className={classNames(
        "rounded py-2 px-4 font-bold text-white",
        `${color} ${hoverColor}`,
        className
      )}
    >
      {children}
    </button>
  );
};
