import { Badge } from "@mantine/core";
import type { Status } from "@prisma/client";
import { MantineColorFromStatus, TextFromStatus } from "../utils.tsx/status";

type ProjectBadgeProps = {
  projectName?: string;
  threadName?: string;
};

export const ProjectBadge = ({
  projectName,
  threadName,
}: ProjectBadgeProps) => {
  return (
    <Badge color={"blue"} variant={"filled"} size="sm">
      {projectName} {threadName && projectName && "/"} {threadName}
    </Badge>
  );
};

type StatusProps = {
  status: Status;
};

export const StatusBadge = ({ status }: StatusProps) => {
  const color = MantineColorFromStatus(status);
  return (
    <Badge color={color} variant={"filled"} size="sm">
      {TextFromStatus(status, true)}
    </Badge>
  );
};
