import type { MantineColor } from "@mantine/core";
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
