import React from "react";
import type { Message, User } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "@mantine/core";
dayjs.extend(relativeTime);

type Props = {
  messsage: Message;
  user?: User;
  onClick: (message: Message) => {};
};

export default function MessageBox({ messsage, user, onClick }: Props) {
  return (
    <li className="flex w-full flex-col items-start justify-start gap-1 border-t-0 border-r-0 border-b border-l-0 border-main bg-hidden p-3">
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch">
        {user ? (
          <>
            <div className="relative h-5 w-5 flex-shrink-0 flex-grow-0 overflow-hidden rounded-full bg-main" />
            <p className="w-full flex-grow text-left text-base font-semibold text-black">
              {user.name}
            </p>
          </>
        ) : (
          <div className="w-full"></div>
        )}
        <Badge color={"blue"} variant={"filled"} size="sm" fullWidth>
          Mysteryland / Main Stage
        </Badge>
      </div>
      <div className="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2.5 self-stretch">
        <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-secondary">
          {dayjs(messsage.createdAt).fromNow()}
        </p>
      </div>
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 self-stretch">
        <p className="w-[587px] flex-grow text-left text-sm text-black">
          {messsage.message}
        </p>
      </div>
    </li>
  );
}
