import { useEffect, useRef, useState } from "react";
import { Modal, Select, TextInput, Checkbox } from "@mantine/core";
import { useActionModalContex } from "../contexts/ActionModalContext";
import {
  ActionTextFromStatus,
  ActivaTextFromStatus,
} from "../utils.tsx/status";
import { useFetcher } from "@remix-run/react";
import { CMButton } from "./CMButton";
import { useTenantContext } from "../contexts/TenantContext";
import { CMImage } from "./CMImage";

export function ActionModal() {
  const tenantContext = useTenantContext();
  const {
    opened,
    data: { status, content, user, reason, otherInformation },
    closeModal,
  } = useActionModalContex();
  const [isLoading, setIsLoading] = useState(false);
  const actionText = ActionTextFromStatus(status);
  const activeText = ActivaTextFromStatus(status);
  const type = content ? "content" : "user";
  const fetcher = useFetcher();
  const formRef = useRef(null);
  const errors: string[] = Object.values(fetcher.data?.fieldErrors ?? []);

  useEffect(() => {
    const hasErrors = (errors.length ?? 0) > 0;
    if (fetcher.state === "submitting" || fetcher.state === "loading") {
      setIsLoading(true);
    } else if (isLoading && !hasErrors && fetcher.state === "idle") {
      // No errors and we are back to idle, submit was successful
      setIsLoading(false);
      closeModal();
    } else {
      setIsLoading(false);
    }
  }, [fetcher.state, fetcher.data, isLoading, errors, closeModal]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => closeModal()}
        title={
          <span className="text-xl font-bold">
            {actionText} {user?.name ?? "Content"}
          </span>
        }
        transitionDuration={150}
        exitTransitionDuration={150}
        centered
        size={"lg"}
      >
        <fetcher.Form
          method="post"
          action={`/${tenantContext.tenant.slug}/actions/${type}`}
          ref={formRef}
        >
          <div className="flex flex-col gap-2">
            <input name="status" type="hidden" value={status} readOnly />
            {user && <input name="userId" readOnly value={user.id} hidden />}
            {content && (
              <input name="contentId" readOnly value={content.id} hidden />
            )}
            {content?.message && (
              <>
                <h2>Message</h2>
                <p className="text-xs font-light">{content?.message.text}</p>
              </>
            )}
            {content?.image && (
              <div className="flex flex-col items-center">
                <CMImage image={content.image} className="h-80" />
              </div>
            )}
            <Select
              name="reasonId"
              label={`Reason for ${actionText}`}
              placeholder={`Select reason for ${activeText}`}
              data={tenantContext.reasons[status].map((reason) => ({
                label: reason.name,
                value: reason.id,
              }))}
              searchable
              defaultValue={reason?.id}
            />
            <TextInput
              name="reasonInformation"
              label="Extra information"
              description="Provide extra information if needed"
              defaultValue={otherInformation}
            />
            {user && (
              <>
                {status === "allowed" && (
                  <Checkbox
                    label={`Allow all user's contents`}
                    name="allowAllContents"
                    defaultChecked={true}
                  />
                )}
                {(status === "flagged" || status === "hidden") && (
                  <>
                    <Checkbox
                      label={`Flag all user's contents`}
                      name="flagAllContents"
                      defaultChecked={status === "flagged"}
                    />
                    <Checkbox
                      label={`Hide all user's contents`}
                      name="hideAllContents"
                      defaultChecked={status === "hidden"}
                    />
                  </>
                )}
              </>
            )}
            {errors.map((error) => (
              <div key={error} className="text-xs text-red-500">
                {error}
              </div>
            ))}

            <CMButton type="submit" status={status} loading={isLoading}>
              {isLoading ? activeText : actionText}
            </CMButton>
          </div>
        </fetcher.Form>
      </Modal>
    </>
  );
}
