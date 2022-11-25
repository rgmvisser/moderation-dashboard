import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardContainer } from "~/shared/components/DashboardContainer";
import MessageBox from "~/shared/components/MessageBox";
import { MessagesStatus } from "~/shared/components/MessageStatus";
import { PropertyContainer } from "~/shared/components/PropertyContainer";
import { json, useLoaderData } from "remix-supertyped";
import { Outlet, useParams } from "@remix-run/react";
import { GetDateFromNow } from "~/shared/utils.tsx/date";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { ActionController } from "~/controllers.ts/action.server";
import { GetTenant } from "~/middleware/tenant";
import { MessageController } from "~/controllers.ts/message.server";
import { UserController } from "~/controllers.ts/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const userId = params["userId"] ?? "";
  const userController = new UserController(tenant);
  const user = await userController.getUserById(tenant, userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const messageController = new MessageController(tenant);
  const messagesStats = await messageController.getUserMessagesStats(userId);
  const messages = await messageController.getUserMessages(userId);
  const actionController = new ActionController(tenant);
  const actions = await actionController.getUserActions(userId);
  return json({ user, messages, messagesStats, actions });
}

export default function User() {
  const params = useParams();
  const currentMessageId = params["messageId"];
  const data = useLoaderData<typeof loader>();
  const { messages, user, messagesStats, actions } = data;

  return (
    <>
      <Outlet />
      <DashboardContainer>
        <CMHeader title={user.name}>
          <StatusBadge status={user.status} />
        </CMHeader>
        <ActionButtons
          flagButton={user.status != "flagged"}
          hideButton={user.status != "hidden"}
          allowButton={user.status != "allowed"}
          user={user}
        />
        <PropertyContainer
          properties={[
            {
              status: "allowed",
              type: "Signin method",
              text: user.signInMethod,
            },
            {
              status: "flagged",
              type: "Created",
              text: GetDateFromNow(user.createdAt),
            },
            {
              status: "allowed",
              type: "Location",
              text: user.location,
            },
          ]}
        />
        <CMHeader title="User Reports" />
        <div className="w-full border-t-0 border-r-0 border-b border-l-0 border-main py-2 px-4">
          No reports
        </div>
        <CMHeader title="Messages status" />
        <MessagesStatus {...messagesStats}></MessagesStatus>

        <ActionContainer actions={actions} />

        <CMHeader title="Messages History" />

        <ul className="w-full flex-grow overflow-y-scroll">
          {messages.map((message) => {
            return (
              <MessageBox
                key={message.id}
                messsage={message}
                project={message.project}
                thread={message.thread}
                user={message.user}
                selected={message.id === currentMessageId}
                showUser={false}
              />
            );
          })}
        </ul>
      </DashboardContainer>
    </>
  );
}
