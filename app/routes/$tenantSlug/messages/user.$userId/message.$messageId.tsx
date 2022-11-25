import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { ProjectBadge, StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardContainer } from "~/shared/components/DashboardContainer";
import { json, useLoaderData } from "remix-supertyped";
import { MessageContents } from "~/shared/components/MessageContents";
import { ActionController } from "~/controllers.ts/action.server";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { GetTenant } from "~/middleware/tenant";
import { UserController } from "~/controllers.ts/user.server";
import { MessageController } from "~/controllers.ts/message.server";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(params);
  const userId = params["userId"] ?? "";
  const userController = new UserController(tenant);
  const user = await userController.getUserById(tenant, userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const messageId = params["messageId"] ?? "";
  const messageController = new MessageController(tenant);
  const message = await messageController.getMessage(messageId);
  if (!message) {
    throw new Error(`Could nog find message:  ${messageId}`);
  }
  const actionController = new ActionController(tenant);
  const actions = await actionController.getMessageActions(messageId);
  return json({ user, message, actions });
}

export default function User() {
  const data = useLoaderData<typeof loader>();
  const { message, actions } = data;
  return (
    <>
      <DashboardContainer>
        <CMHeader title="Message">
          <StatusBadge status={message.status} />
          <ProjectBadge
            projectName={message.project.name}
            threadName={message.thread.name}
          />
        </CMHeader>
        <ActionButtons
          flagButton={message.status != "flagged"}
          hideButton={message.status != "hidden"}
          allowButton={message.status != "allowed"}
          message={message}
        />
        <MessageContents
          contents={[
            {
              title: "Original content",
              content: message.message,
            },
            {
              title: "Parsed content",
              content: message.message,
            },
          ]}
        />
        <CMHeader title="User Reports" />
        <div className="w-full border-t-0 border-r-0 border-b border-l-0 border-main py-2 px-4">
          No reports
        </div>
        <ActionContainer actions={actions} />
      </DashboardContainer>
    </>
  );
}
