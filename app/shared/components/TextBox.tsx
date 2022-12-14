import classNames from "classnames";

type SubHeadingProps = React.HTMLProps<HTMLParagraphElement> & {
  children: React.ReactNode;
  className?: string;
};

export function TextBox({ children, className, ...rest }: SubHeadingProps) {
  return (
    <p
      className={classNames(
        "rounded border border-main bg-slate-50 p-1 text-left text-sm",
        className
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
