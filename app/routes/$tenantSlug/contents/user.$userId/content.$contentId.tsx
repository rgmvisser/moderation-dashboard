import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { ProjectBadge, StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardContainer } from "~/shared/components/DashboardContainer";
import { json, useLoaderData } from "remix-supertyped";
import { ActionController } from "~/controllers.ts/action.server";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { GetTenant } from "~/middleware/tenant";
import { UserController } from "~/controllers.ts/user.server";
import { ContentController } from "~/controllers.ts/content.server";
import { ContentContainer } from "~/shared/components/ContentContainer";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const userId = params["userId"] ?? "";
  const userController = new UserController(tenant);
  const user = await userController.getUserById(tenant, userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const contentId = params["contentId"] ?? "";
  const contentController = new ContentController(tenant);
  const content = await contentController.getContent(contentId);
  if (!content) {
    throw new Error(`Could nog find content:  ${contentId}`);
  }
  const actionController = new ActionController(tenant);
  const actions = await actionController.getContentActions(contentId);
  return json({ user, content, actions });
}

export default function User() {
  const data = useLoaderData<typeof loader>();
  const { content, actions } = data;
  return (
    <>
      <DashboardContainer>
        <CMHeader title="Content">
          <StatusBadge status={content.status} />
          <ProjectBadge
            projectName={content.project.name}
            topicName={content.topic.name}
          />
        </CMHeader>
        <ActionButtons
          flagButton={content.status != "flagged"}
          hideButton={content.status != "hidden"}
          allowButton={content.status != "allowed"}
          content={content}
        />
        <ContentContainer
          contents={[
            {
              title: "Original content",
              content: content.content,
            },
            {
              title: "Parsed content",
              content: content.content,
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
