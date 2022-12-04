import classNames from "classnames";

type SubHeadingProps = React.HTMLProps<HTMLHeadingElement> & {
  children: React.ReactNode;
  className?: string;
};

export function SubHeading({ children, className, ...rest }: SubHeadingProps) {
  return (
    <h2
      className={classNames("mb-4 text-lg font-semibold", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}
