import { CMButton } from "./CMButton";

interface ActionButtonProps {
  allowButton?: boolean;
  flagButton?: boolean;
  hideButton?: boolean;
  type: "user" | "message";
}

export const ActionButtons = ({
  allowButton,
  flagButton,
  hideButton,
  type,
}: ActionButtonProps) => {
  return (
    <div className="flex h-fit w-full items-stretch justify-center gap-4 p-4">
      {allowButton && (
        <CMButton status="allowed" className="flex-grow">
          Allow {type}
        </CMButton>
      )}
      {flagButton && (
        <CMButton status="flagged" className="flex-grow">
          Flag {type}
        </CMButton>
      )}
      {hideButton && (
        <CMButton status="hidden" className="flex-grow">
          Hide {type}
        </CMButton>
      )}
    </div>
  );
};
