import { useEffect, useRef, useState } from "react";
import { Modal, Select, TextInput, Checkbox } from "@mantine/core";
import { useAppContext } from "../contexts/AppContext";
import { useModalContex } from "../contexts/ModalContext";
import {
  ActionTextFromStatus,
  ActivaTextFromStatus,
} from "../utils.tsx/status";
import { useFetcher } from "@remix-run/react";
import { CMButton } from "./CMButton";

export function ActionModal() {
  const appContext = useAppContext();
  const { opened, status, message, user, closeModal } = useModalContex();
  const [isLoading, setIsLoading] = useState(false);
  const actionText = ActionTextFromStatus(status);
  const activeText = ActivaTextFromStatus(status);
  const type = message ? "message" : "user";
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
            {actionText} {user?.name ?? "Message"}
          </span>
        }
        transitionDuration={150}
        exitTransitionDuration={150}
        centered
        size={"lg"}
      >
        <fetcher.Form method="post" action={`/actions/${type}`} ref={formRef}>
          <div className="flex flex-col gap-2">
            <input name="status" type="hidden" value={status} readOnly />
            {user && <input name="userId" readOnly value={user.id} hidden />}
            {message && (
              <input name="messageId" readOnly value={message.id} hidden />
            )}
            {message && (
              <>
                <h2>Message</h2>
                <p className="text-xs font-light">{message?.message}</p>
              </>
            )}
            <Select
              name="reasonId"
              label={`Reason for ${actionText}`}
              placeholder={`Select reason for ${activeText}`}
              data={appContext.reasons[status].map((reason) => ({
                label: reason.name,
                value: reason.id,
              }))}
            />
            <TextInput
              name="extraInformation"
              label="Extra information"
              description="Provide extra information if needed"
            />
            {user && (
              <>
                {status === "allowed" && (
                  <Checkbox
                    label={`Allow all user's messages`}
                    name="allowAllMessages"
                    defaultChecked={true}
                  />
                )}
                {(status === "flagged" || status === "hidden") && (
                  <>
                    <Checkbox
                      label={`Flag all user's messages`}
                      name="flagAllMessages"
                      defaultChecked={status === "flagged"}
                    />
                    <Checkbox
                      label={`Hide all user's messages`}
                      name="hideAllMessages"
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
