import type { ReactNode } from "react";
import type { ActionWithReasonAndExecutor } from "~/controllers/action.server";
import { GetActionInfo } from "../utils.tsx/action";
import { GetDateFormatted, GetDateFromNow } from "../utils.tsx/date";
import { ActionStatusBadge } from "./CMBadge";
import { CMHeader } from "./CMHeader";

type Props = {
  children?: ReactNode;
  actions: ActionWithReasonAndExecutor[];
};
export const ActionContainer = ({ actions }: Props) => {
  return (
    <>
      <CMHeader title="Action Log" />
      <div className="flex flex-col items-stretch self-stretch">
        {actions.map((action) => (
          <ActionItem key={action.id} action={action}></ActionItem>
        ))}
      </div>
    </>
  );
};

const ActionItem = ({ action }: { action: ActionWithReasonAndExecutor }) => {
  const info = GetActionInfo(action);

  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-2 border-t-0 border-r-0 border-b border-l-0 border-main p-3  hover:bg-slate-50`}
    >
      <div className="flex flex-shrink-0 flex-grow-0 items-center justify-between gap-2 self-stretch">
        {info.type === "ChangeStatus" && (
          <ActionStatusBadge
            fromStatus={info.fromStatus}
            toStatus={info.toStatus}
          />
        )}
        <p
          className="flex-shrink-0 flex-grow-0 text-left text-xs text-secondary"
          title={GetDateFormatted(action.createdAt)}
        >
          {GetDateFromNow(action.createdAt)} by {action.takenBy?.name}
        </p>
      </div>

      <p className="flex-grow text-left text-sm">
        {action.reason.name}
        {action.reasonInformation && `: ${action.reasonInformation}`}
      </p>
    </div>
  );
};
