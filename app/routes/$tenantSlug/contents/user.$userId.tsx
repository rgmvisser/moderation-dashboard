import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardInnerContainer } from "~/shared/components/DashboardInnerContainer";
import ContentBox from "~/shared/components/ContentBox";
import { ContentsStatus } from "~/shared/components/ContentStatus";
import { PropertyContainer } from "~/shared/components/PropertyContainer";
import { json, useLoaderData } from "remix-supertyped";
import { Outlet, useParams } from "@remix-run/react";
import { GetDateFromNow } from "~/shared/utils.tsx/date";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { ActionController } from "~/controllers/action.server";
import { GetTenant } from "~/middleware/tenant";
import { ContentController } from "~/controllers/content.server";
import { UserController } from "~/controllers/user.server";
import CMAvatar from "~/shared/components/CMAvatar";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const userId = params["userId"] ?? "";
  const userController = new UserController(tenant);
  const user = await userController.getUserById(userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const contentController = new ContentController(tenant);
  const contentsStats = await contentController.getUserContentsStats(userId);
  const contents = await contentController.getUserContents(userId);
  const actionController = new ActionController(tenant);
  const actions = await actionController.getUserActions(userId);
  return json({ user, contents, contentsStats, actions });
}

export default function User() {
  const params = useParams();
  const currentContentId = params["contentId"];
  const data = useLoaderData<typeof loader>();
  const { contents, user, contentsStats, actions } = data;

  return (
    <>
      <Outlet />
      <DashboardInnerContainer>
        <CMHeader title={user.name ?? ""} image={<CMAvatar />}>
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
              text: user.location ?? "Unknown location",
            },
          ]}
        />
        <CMHeader title="User Reports" />
        <div className=" py-2 px-2 text-sm text-secondary">No reports</div>
        <CMHeader title="Contents status" />
        <ContentsStatus {...contentsStats}></ContentsStatus>

        <ActionContainer actions={actions} />

        <CMHeader title="Content History" />

        <ul className="w-full flex-grow overflow-y-scroll">
          {contents.map((content) => {
            return (
              <ContentBox
                key={content.id}
                content={content}
                project={content.project}
                topic={content.topic}
                user={content.user}
                selected={content.id === currentContentId}
                showUser={false}
              />
            );
          })}
        </ul>
      </DashboardInnerContainer>
    </>
  );
}
