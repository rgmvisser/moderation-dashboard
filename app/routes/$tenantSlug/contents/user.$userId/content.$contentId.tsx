import type { LoaderArgs } from "@remix-run/node";
import { ActionButtons } from "~/shared/components/ActionButtons";
import { ProjectBadge, StatusBadge } from "~/shared/components/CMBadge";
import { CMHeader } from "~/shared/components/CMHeader";
import { DashboardInnerContainer } from "~/shared/components/DashboardInnerContainer";
import { json, useLoaderData } from "remix-supertyped";
import { ActionController } from "~/controllers/action.server";
import { ActionContainer } from "~/shared/components/ActionContainer";
import { GetTenant } from "~/middleware/tenant";
import { UserController } from "~/controllers/user.server";
import { ContentController } from "~/controllers/content.server";
import { CMImage } from "~/shared/components/CMImage";
import { useEffect, useRef, useState } from "react";
import { useActionModalContex } from "~/shared/contexts/ActionModalContext";
import { Status, TextInformation } from "@prisma/client";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import ContentBox from "~/shared/components/ContentBox";
import { TextBox } from "~/shared/components/TextBox";

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
  const contentContext = await contentController.getContext(content);
  return json({ user, content, actions, imageInfo, contentContext });
}

export default function Content() {
  const data = useLoaderData<typeof loader>();
  const { reasonForCategories } = useTenantContext();
  const { setOpened } = useActionModalContex();
  const [showMore, setShowMore] = useState(false);
  const contentInContextRef = useRef<HTMLLIElement>();
  const contentInContextContainerRef = useRef<HTMLUListElement>(null);
  const { content, actions, imageInfo, contentContext } = data;
  const ocr = imageInfo?.ocr;
  const labels = imageInfo?.labels;
  const imageTextInformation = imageInfo?.imageTextInformation;
  const ocrCharacterCutOffLength = 200;

  useEffect(() => {
    // Scroll to the middle of the content in context
    if (contentInContextRef.current && contentInContextContainerRef.current) {
      const rect = contentInContextContainerRef.current.getBoundingClientRect();
      const top = rect.height / 2;
      contentInContextContainerRef.current.scrollTo(0, top);
    }
  }, [content]);

  return (
    <>
      <DashboardInnerContainer>
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
        <div className="overflow-y-auto">
          {content.message && (
            <div className="box-border flex h-fit w-full flex-col items-stretch justify-start gap-2.5  px-2 py-2">
              <div>
                <p className="text-xl font-bold ">Original Message</p>
                <TextBox>{content.message.text}</TextBox>
              </div>
              {content.message.textInformation && (
                <ParsedContents
                  textInformation={content.message.textInformation}
                />
              )}
            </div>
          )}
          {content.image && (
            <div className="flex flex-col items-center">
              <CMImage image={content.image} className="h-60 py-2" />
            </div>
          )}

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
              <div className="flex flex-col items-stretch justify-start gap-2.5 py-2 px-2 ">
                {imageTextInformation && (
                  <ParsedContents
                    textInformation={imageTextInformation}
                    includeMessage={false}
                  />
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
          <CMHeader title="Message Context" />
          <ul
            className="max-h-96 w-full flex-grow overflow-y-scroll"
            ref={contentInContextContainerRef}
          >
            {contentContext.map((c) => {
              return (
                <ContentBox
                  key={c.id}
                  content={c}
                  project={c.project}
                  topic={c.topic}
                  user={c.user}
                  selected={c.id === content.id}
                  showUser={true}
                  ref={
                    c.id === content.id
                      ? (contentInContextRef as any)
                      : undefined
                  }
                />
              );
            })}
          </ul>
        </div>
      </DashboardInnerContainer>
    </>
  );
}

function ParsedContents({
  textInformation,
  includeMessage = true,
}: {
  textInformation: TextInformation;
  includeMessage?: boolean;
}) {
  return (
    <>
      {includeMessage ? (
        <div>
          <p className="text-xl font-bold ">Parsed Message</p>
          <TextBox>{textInformation.normalizedText}</TextBox>
        </div>
      ) : null}
      <ParsedContent type="Phone Numbers" list={textInformation.phoneNumbers} />
      <ParsedContent type="Emails" list={textInformation.emails} />
      <ParsedContent type="Domains" list={textInformation.domains} />
      <ParsedContent type="Mentions" list={textInformation.mentions} />
    </>
  );
}

function ParsedContent({ type, list }: { type: string; list: string[] }) {
  return list.length > 0 ? (
    <div className="flex flex-row gap-2">
      <p className="font-bold ">{type}</p>
      {list.map((item) => (
        <span
          key={item}
          className="rounded-full bg-main py-1 px-2 text-xs text-white"
        >
          {item}
        </span>
      ))}
    </div>
  ) : null;
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
