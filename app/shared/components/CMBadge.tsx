import type { MantineColor } from "@mantine/core";
import { Badge } from "@mantine/core";
import type { Status } from "@prisma/client";
import {
  ActionTextFromStatus,
  MantineColorFromStatus,
  TextFromStatus,
} from "../utils.tsx/status";
import { TruncateMiddle } from "../utils.tsx/strings";

type ProjectBadgeProps = {
  projectName?: string;
  topicName?: string;
};

export const ProjectBadge = ({ projectName, topicName }: ProjectBadgeProps) => {
  const text = `${projectName} ${topicName && projectName && "/"} ${topicName}`;
  return (
    <Badge color={"blue"} variant={"filled"} size="xs" title={text}>
      {TruncateMiddle(text, 50)}
    </Badge>
  );
};

type StatusProps = {
  status: Status;
  verb?: boolean;
};

export const StatusBadge = ({ status, verb = false }: StatusProps) => {
  const color = MantineColorFromStatus(status);
  return (
    <Badge color={color} variant={"filled"} size="sm">
      {verb ? ActionTextFromStatus(status, true) : TextFromStatus(status, true)}
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
  if (isNaN(percentage)) {
    return (
      <Badge color="gray" variant={"filled"} size="sm">
        ?
      </Badge>
    );
  }
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
