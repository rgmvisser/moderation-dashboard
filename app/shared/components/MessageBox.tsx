import React from "react";
import type { Message, User } from "@prisma/client";

type Props = {
  messsage: Message;
  user: User;
};

export default function MessageBox({ messsage, user }: Props) {
  return (
    <div className="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-1 self-stretch border-t-0 border-r-0 border-b border-l-0 border-[#dedede] bg-white p-3">
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 self-stretch">
        <div className="relative h-10 w-10 flex-shrink-0 flex-grow-0 overflow-hidden rounded-[20px] bg-[#339af0]" />
        <p className="w-[226px] flex-grow text-left text-base font-semibold text-black">
          {user.name}
        </p>
      </div>
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 self-stretch">
        <p className="w-[276px] flex-grow text-left text-sm text-black">
          {messsage.message}
        </p>
      </div>
    </div>
  );
}
