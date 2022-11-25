import React from "react";
import type { Message, Project, Thread, User } from "@prisma/client";
import { BGColorFromStatus, ButtonColorFromStatus } from "../utils.tsx/status";
import { ProjectBadge } from "./CMBadge";
import { GetDateFormatted, GetDateFromNow } from "../utils.tsx/date";
import { Link } from "react-router-dom";
import { MessagePath, UserPath } from "../utils.tsx/navigation";
import { useTenantContext } from "../contexts/TenantContext";

type Props = {
  messsage: Message;
  project: Project;
  thread: Thread;
  user: User;
  selected: boolean;
  showUser?: boolean;
};

export default function MessageBox({
  messsage,
  project,
  thread,
  user,
  selected,
  showUser = true,
}: Props) {
  const background = selected
    ? "bg-slate-100"
    : BGColorFromStatus(messsage.status);
  const userStatusBG = ButtonColorFromStatus(user.status);
  const tenantContext = useTenantContext();
  return (
    <li
      className={`flex w-full flex-col items-start justify-start gap-1 border-t-0 border-r-0 border-b border-l-0 border-main p-3 ${background} hover:bg-slate-50`}
    >
      <div className="flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch">
        {showUser ? (
          <Link
            to={UserPath(tenantContext.tenantSlug, user.id)}
            className="flex-auto "
          >
            <div className="flex  items-center gap-2 hover:cursor-pointer hover:underline">
              <div className="relative h-5 w-5 overflow-hidden rounded-full bg-main" />
              <p className="flex-full text-left text-base font-semibold text-black">
                {user.name}
              </p>
              <div
                className={`h-2 w-2 overflow-hidden rounded-full ${userStatusBG}`}
              />
            </div>
          </Link>
        ) : (
          <div className="flex-auto"></div>
        )}
        <ProjectBadge projectName={project.name} threadName={thread.name} />
      </div>
      <Link to={MessagePath(tenantContext.tenantSlug, user.id, messsage.id)}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-start justify-center self-stretch">
            <p
              className="flex-shrink-0 flex-grow-0 text-left text-xs text-secondary"
              title={GetDateFormatted(messsage.createdAt)}
            >
              {GetDateFromNow(messsage.createdAt)}
            </p>
          </div>

          <div className="flex  items-center justify-start gap-2.5 self-stretch">
            <p className="flex-grow text-left text-sm">{messsage.message}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
