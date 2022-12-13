import type { User } from "@prisma/client";
import type { MessageOrImage } from "~/models/content";
import { useActionModalContex } from "../contexts/ActionModalContext";
import { CMButton } from "./CMButton";

interface ActionButtonProps {
  allowButton?: boolean;
  flagButton?: boolean;
  hideButton?: boolean;
  user?: User;
  content?: MessageOrImage;
}

export const ActionButtons = ({
  allowButton,
  flagButton,
  hideButton,
  content,
  user,
}: ActionButtonProps) => {
  const { setOpened } = useActionModalContex();
  let type = content ? "content" : "user";
  return (
    <div className="flex h-fit w-full items-stretch justify-center gap-4 p-2">
      {allowButton && (
        <CMButton
          status="allowed"
          className="flex-grow"
          onClick={() => setOpened(true, { status: "allowed", content, user })}
        >
          Allow {type}
        </CMButton>
      )}
      {flagButton && (
        <CMButton
          status="flagged"
          className="flex-grow"
          onClick={() => setOpened(true, { status: "flagged", content, user })}
        >
          Flag {type}
        </CMButton>
      )}
      {hideButton && (
        <CMButton
          status="hidden"
          className="flex-grow"
          onClick={() => setOpened(true, { status: "hidden", content, user })}
        >
          Hide {type}
        </CMButton>
      )}
    </div>
  );
};
