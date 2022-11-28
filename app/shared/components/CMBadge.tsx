import { Badge, MantineColor } from "@mantine/core";
import type { Status } from "@prisma/client";
import { MantineColorFromStatus, TextFromStatus } from "../utils.tsx/status";

type ProjectBadgeProps = {
  projectName?: string;
  topicName?: string;
};

export const ProjectBadge = ({ projectName, topicName }: ProjectBadgeProps) => {
  return (
    <Badge color={"blue"} variant={"filled"} size="sm">
      {projectName} {topicName && projectName && "/"} {topicName}
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
type ActionStatusProps = {
  toStatus: Status;
  fromStatus: Status;
};
export const ActionStatusBadge = ({
  toStatus,
  fromStatus,
}: ActionStatusProps) => {
  const color = MantineColorFromStatus(toStatus);
  return (
    <Badge color={color} variant={"filled"} size="sm">
      {TextFromStatus(fromStatus, true)} {"->"} {TextFromStatus(toStatus, true)}
    </Badge>
  );
};

export const PercentageBadge = ({
  status,
  percentage,
}: {
  status: Status;
  percentage: number;
}) => {
  let color: MantineColor = "green";
  if (status === "allowed") {
    if (percentage < 95 && percentage >= 75) {
      color = "orange";
    } else if (percentage < 75) {
      color = "red";
    }
  } else {
    if (percentage < 5 && percentage >= 2) {
      color = "orange";
    } else if (percentage >= 5) {
      color = "red";
    }
  }

  return (
    <Badge color={color} variant={"filled"} size="sm">
      {percentage.toFixed(1)}%
    </Badge>
  );
};
