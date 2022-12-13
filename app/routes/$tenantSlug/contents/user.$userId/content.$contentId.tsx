import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { ProjectBadge, StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardContainer } from "~/shared/components/DashboardContainer";
import { json, useLoaderData } from "remix-supertyped";
import { ActionController } from "~/controllers/action.server";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { GetTenant } from "~/middleware/tenant";
import { UserController } from "~/controllers/user.server";
import { ContentController } from "~/controllers/content.server";
import { ContentTextContainer } from "~/shared/components/ContentTextContainer";
import { CMImage } from "~/shared/components/CMImage";
import { useState } from "react";
import { useActionModalContex } from "~/shared/contexts/ActionModalContext";
import { Status } from "@prisma/client";
import { useTenantContext } from "~/shared/contexts/TenantContext";

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const userId = params["userId"] ?? "";
  const userController = new UserController(tenant);
  const user = await userController.getUserById(userId);
  if (!user) {
    throw new Error(`Could nog find user:  ${userId}`);
  }
  const contentId = params["contentId"] ?? "";
  const contentController = new ContentController(tenant);
  const content = await contentController.getContent(contentId);
  if (!content) {
    throw new Error(`Could nog find content:  ${contentId}`);
  }
  const imageInfo = await contentController.getImageInformation(content);
  const actionController = new ActionController(tenant);
  const actions = await actionController.getContentActions(contentId);
  return json({ user, content, actions, imageInfo });
}

export default function Content() {
  const data = useLoaderData<typeof loader>();
  const { reasonForCategories } = useTenantContext();
  const { setOpened } = useActionModalContex();
  const [showMore, setShowMore] = useState(false);
  const { content, actions, imageInfo } = data;
  const ocr = imageInfo?.ocr;
  const labels = imageInfo?.labels;
  const ocrCharacterCutOffLength = 200;
  return (
    <>
      <DashboardContainer>
        <CMHeader title={content.message ? "Message" : "Image"}>
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
        {content.message && (
          <ContentTextContainer
            contents={[
              {
                title: "Original content",
                content: content.message.text,
              },
              {
                title: "Parsed content",
                content: content.message.text,
              },
            ]}
          />
        )}
        {content.image && (
          <div className="flex flex-col items-center">
            <CMImage image={content.image} className="h-60 py-2" />
          </div>
        )}
        <div className="overflow-y-auto">
          {imageInfo && (
            <>
              <CMHeader title="Text From Image" />
              <div className="py-2 px-2 text-sm text-secondary ">
                {ocr == null ? (
                  "No OCR done yet on image"
                ) : ocr.length === 0 ? (
                  `No text found in image`
                ) : (
                  <span className="italic">
                    {ocr
                      .slice(0, showMore ? undefined : ocrCharacterCutOffLength)
                      .trim()}
                  </span>
                )}

                {ocr && ocr?.length > ocrCharacterCutOffLength && (
                  <>
                    {!showMore && "..."}
                    <span
                      className="cursor-pointer text-main"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {" "}
                      {showMore ? "Show less" : "Show more"}
                    </span>
                  </>
                )}
              </div>
              <CMHeader title="Labels From Image" />
              <div className="py-2 px-2 text-sm text-secondary">
                {labels == null ? (
                  "No labeling done yet on image"
                ) : labels.length === 0 ? (
                  `No labels found on image`
                ) : (
                  <LabelPills
                    labels={labels}
                    onClick={(label, value) =>
                      setOpened(true, {
                        status: Status.hidden,
                        content,
                        reason: reasonForCategories[label],
                        otherInformation: `From labelling: (${label}:${value.toFixed(
                          2
                        )})`,
                      })
                    }
                  />
                )}
              </div>
            </>
          )}
          <CMHeader title="User Reports" />
          <div className="py-2 px-2 text-sm text-secondary">No reports</div>
          <ActionContainer actions={actions} />
        </div>
      </DashboardContainer>
    </>
  );
}

function LabelPills({
  labels,
  onClick,
}: {
  labels: Record<string, number>;
  onClick: (label: string, value: number) => void;
}) {
  if (Object.keys(labels).length === 0) {
    return <span className="text-secondary">No labels found</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(labels).map(([label, value]) => {
        let color = "";
        if (value < 10) {
          color = "bg-red-300";
        } else if (value < 25) {
          color = "bg-red-400";
        } else if (value < 50) {
          color = "bg-red-500";
        } else if (value < 75) {
          color = "bg-red-600";
        } else if (value < 90) {
          color = "bg-red-700";
        } else if (value < 95) {
          color = "bg-red-800";
        } else {
          color = "bg-red-900";
        }
        return (
          <span
            key={label}
            className={`${color} rounded-md px-2 py-1 text-sm text-white hover:cursor-pointer hover:shadow-inner`}
            onClick={() => onClick(label, value)}
          >
            {label}: {value.toFixed(2)}
          </span>
        );
      })}
    </div>
  );
}
