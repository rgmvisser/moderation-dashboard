import type { Action, Status } from "@prisma/client";

export function GetActionInfo<T extends Action>(action: T) {
  const info = action.info as any;
  if (action.type === "ChangeStatus") {
    return {
      type: action.type,
      toStatus: info.toStatus as Status,
      fromStatus: info.fromStatus as Status,
    };
  }
  return {};
}
