import React from "react";
import type { Project, Topic, User } from "@prisma/client";
import { BGColorFromStatus, ButtonColorFromStatus } from "../utils.tsx/status";
import { ProjectBadge } from "./CMBadge";
import { GetDateFormatted, GetDateFromNow } from "../utils.tsx/date";
import { Link } from "react-router-dom";
import { ContentPath, UserPath } from "../utils.tsx/navigation";
import { useTenantContext } from "../contexts/TenantContext";
import type { MessageOrImage } from "~/models/content";
import { CMImage } from "./CMImage";

type Props = {
  content: MessageOrImage;
  project: Project;
  topic: Topic;
  user: User;
  selected: boolean;
  showUser?: boolean;
} & React.HTMLAttributes<HTMLLIElement>;

const ContentBox = React.forwardRef<HTMLLIElement, Props>(
  (
    { content, project, topic, user, selected, showUser = true, ...rest },
    ref
  ) => {
    const background = BGColorFromStatus(content.status);
    const userStatusBG = ButtonColorFromStatus(user.status);
    const tenantContext = useTenantContext();
    return (
      <li
        ref={ref}
        className={`flex w-full flex-col items-stretch justify-start gap-1 border-t-0 border-r-0 border-b border-l-0 border-main p-2 ${background} relative hover:bg-slate-50`}
        {...rest}
      >
        {selected ? (
          <div className="absolute top-0 left-0 h-full w-1 bg-slate-700"></div>
        ) : null}
        <div className="flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch">
          {showUser ? (
            <Link
              to={UserPath(tenantContext.tenant.slug, user.id)}
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
          <ProjectBadge projectName={project.name} topicName={topic.name} />
        </div>
        <Link to={ContentPath(tenantContext.tenant.slug, user.id, content.id)}>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col items-start justify-center self-stretch">
              <p
                className="flex-shrink-0 flex-grow-0 text-left text-xs text-secondary"
                title={GetDateFormatted(content.createdAt)}
              >
                {GetDateFromNow(content.createdAt)}
              </p>
            </div>

            <div className="flex  items-center justify-start gap-2.5 self-stretch">
              {content.message && (
                <p className="flex-grow text-left text-sm">
                  {content.message.text}
                </p>
              )}
              {content.image && <CMImage image={content.image} />}
            </div>
          </div>
        </Link>
      </li>
    );
  }
);

ContentBox.displayName = "ContentBox";

export default ContentBox;
