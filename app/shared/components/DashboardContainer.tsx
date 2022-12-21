import classNames from "classnames";
import { HTMLProps } from "react";

export default function DashboardContainer({
  title,
  rightItem,
  children,
}: {
  title: string;
  children: React.ReactNode;
  rightItem?: React.ReactNode;
}) {
  return (
    <Container>
      <Header title={title} rightItem={rightItem} />
      <Box>{children}</Box>
    </Container>
  );
}

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full flex-col gap-2">{children} </div>;
};

export const Header = ({
  title,
  rightItem,
}: {
  title: string;
  rightItem?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1>{title}</h1>
      {rightItem}
    </div>
  );
};

export const Box = ({
  children,
  className,
  ...rest
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        "flex h-full flex-col gap-4 rounded-xl border border-main bg-white p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
