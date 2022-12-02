import classNames from "classnames";
import type { ReactNode } from "react";

interface CMIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant: "danger" | "primary" | "secondary";
}

const varientColors: Record<CMIconButtonProps["variant"], string> = {
  danger: "bg-red-500 hover:bg-red-600",
  primary: "bg-blue-500 hover:bg-blue-600",
  secondary: "bg-gray-500 hover:bg-gray-600",
};

export const CMIconButton = ({
  children,
  className,
  variant,
  ...rest
}: CMIconButtonProps) => {
  const colors = varientColors[variant];
  return (
    <button
      className={classNames(
        "rounded-full p-[2px] text-white",
        "flex items-center justify-center",
        `${colors}`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
