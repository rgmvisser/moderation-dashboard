import type { Status } from "@prisma/client";
import { ButtonColorFromStatus, TextFromStatus } from "../utils.tsx/status";

export const ContentsStatus = ({
  allowed,
  flagged,
  hidden,
  total,
}: {
  allowed: number;
  flagged: number;
  hidden: number;
  total: number;
}) => {
  const allowPerc = (allowed / total) * 100;
  const flaggedPerc = (flagged / total) * 100;
  const hiddenPerc = (hidden / total) * 100;
  return (
    <div className="w-full border-t-0 border-r-0 border-b border-l-0 border-main py-4 px-4">
      <div className="relative flex h-[30px] w-full overflow-hidden rounded-[15px] ">
        {allowed > 0 && (
          <StatusComponent status="allowed" percentage={allowPerc} />
        )}
        {flagged > 0 && (
          <StatusComponent status="flagged" percentage={flaggedPerc} />
        )}
        {hidden > 0 && (
          <StatusComponent status="hidden" percentage={hiddenPerc} />
        )}
      </div>
    </div>
  );
};

const StatusComponent = ({
  status,
  percentage,
}: {
  status: Status;
  percentage: number;
}) => {
  const color = ButtonColorFromStatus(status);
  const text = TextFromStatus(status, true);
  let textSize = "text-xs";
  if (percentage < 15) {
    textSize = "text-[8px]";
  }
  return (
    <span
      className={`flex h-[30px] items-center justify-center self-stretch overflow-hidden ${color}`}
      style={{ width: `${percentage}%` }}
    >
      <p className={`text-center ${textSize} font-bold text-white`}>
        {percentage >= 8 && text}
      </p>
    </span>
  );
};
