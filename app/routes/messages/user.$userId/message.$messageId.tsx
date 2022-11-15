import type { LoaderArgs } from "@remix-run/node";
import { getMessage } from "~/models/message.server";
import { getUserById } from "~/models/user.server";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { ProjectBadge, StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardContainer } from "~/shared/components/DashboardContainer";
import { json, useLoaderData } from "remix-supertyped";
import { MessageContents } from "~/shared/components/MessageContents";

export async function loader({ request, params }: LoaderArgs) {
  const userId = params["userId"] ?? "";
  const user = await getUserById(userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const messageId = params["messageId"] ?? "";
  const message = await getMessage(messageId);
  if (!message) {
    throw new Error(`Could nog find message:  ${messageId}`);
  }
  return json({ user, message });
}

export default function User() {
  const data = useLoaderData<typeof loader>();
  const { message, user } = data;
  return (
    <>
      <DashboardContainer>
        <CMHeader title="Message">
          <StatusBadge status={user.status} />
          <ProjectBadge
            projectName={message.project.name}
            threadName={message.thread.name}
          />
        </CMHeader>
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
        <ActionButtons
          flagButton={message.status != "flagged"}
          hideButton={message.status != "hidden"}
          allowButton={message.status != "allowed"}
          type="message"
        />
      </DashboardContainer>
    </>
  );
}
