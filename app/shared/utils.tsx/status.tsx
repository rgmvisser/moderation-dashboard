import { FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, MantineColor } from "@mantine/core";
import { Status } from "@prisma/client";

export function BGColorFromStatus(status: Status) {
  switch (status) {
    case Status.allowed:
      return "";
    case Status.flagged:
      return "bg-flagged-light";
    case Status.hidden:
      return "bg-hidden-light";
  }
}

export function ButtonColorFromStatus(status: Status) {
  switch (status) {
    case Status.allowed:
      return "bg-allowed";
    case Status.flagged:
      return "bg-flagged";
    case Status.hidden:
      return "bg-hidden";
  }
}

export function ButtonHoverColorFromStatus(status: Status) {
  switch (status) {
    case Status.allowed:
      return "hover:bg-allowed-dark";
    case Status.flagged:
      return "hover:bg-flagged-dark";
    case Status.hidden:
      return "hover:bg-hidden-dark";
  }
}

export function MantineColorFromStatus(status: Status): MantineColor {
  switch (status) {
    case Status.allowed:
      return "green";
    case Status.flagged:
      return "orange";
    case Status.hidden:
      return "red";
  }
}

export function TextFromStatus(status: Status, caps = false) {
  if (caps) {
    return status.toUpperCase();
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type IconProps = { status: Status } & React.ComponentPropsWithoutRef<"svg">;

export function IconFromStatus({ status, ...rest }: IconProps) {
  switch (status) {
    case Status.allowed:
      return <CheckIcon {...rest} />;
    case Status.flagged:
      return <FlagIcon {...rest} />;
    case Status.hidden:
      return <XMarkIcon {...rest} />;
  }
}

export function ActionTextFromStatus(status: Status, caps = false) {
  switch (status) {
    case Status.allowed:
      return "Allow";
    case Status.flagged:
      return "Flag";
    case Status.hidden:
      return "Hide";
  }
}

export function ActivaTextFromStatus(status: Status, caps = false) {
  switch (status) {
    case Status.allowed:
      return "Allowing";
    case Status.flagged:
      return "Flagging";
    case Status.hidden:
      return "Hiding";
  }
}
