import type { Message, User } from "@prisma/client";
import { useModalContex } from "../contexts/ModalContext";
import { CMButton } from "./CMButton";

interface ActionButtonProps {
  allowButton?: boolean;
  flagButton?: boolean;
  hideButton?: boolean;
  user?: User;
  message?: Message;
}

export const ActionButtons = ({
  allowButton,
  flagButton,
  hideButton,
  message,
  user,
}: ActionButtonProps) => {
  const { setOpened } = useModalContex();
  let type = message ? "message" : "user";
  return (
    <div className="flex h-fit w-full items-stretch justify-center gap-4 p-4">
      {allowButton && (
        <CMButton
          status="allowed"
          className="flex-grow"
          onClick={() => setOpened(true, "allowed", message, user)}
        >
          Allow {type}
        </CMButton>
      )}
      {flagButton && (
        <CMButton
          status="flagged"
          className="flex-grow"
          onClick={() => setOpened(true, "flagged", message, user)}
        >
          Flag {type}
        </CMButton>
      )}
      {hideButton && (
        <CMButton
          status="hidden"
          className="flex-grow"
          onClick={() => setOpened(true, "hidden", message, user)}
        >
          Hide {type}
        </CMButton>
      )}
    </div>
  );
};
