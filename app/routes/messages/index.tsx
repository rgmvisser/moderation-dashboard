import type { Message, User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { json, useLoaderData } from "remix-supertyped";
import { db } from "~/db.server";
import MessageBox from "~/shared/components/MessageBox";
import { useSocket } from "~/shared/contexts/SocketContext";
import { JSONParseWithDates } from "~/shared/utils.tsx/json";

type MessageWithUser = Message & { user: User };

export async function loader({ request }: LoaderArgs) {
  const messages = await db.message.findMany({
    take: 10,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return json({ messages });
}

export default function Messages() {
  const data = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState<MessageWithUser[]>(
    data.messages ?? []
  );
  const socket = useSocket();
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    bottomLineRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;
    const handler = socket.on("new-message", (newMessageData) => {
      const newMessage = JSONParseWithDates(newMessageData)
        .message as MessageWithUser;
      setMessages((messages) => [...messages, newMessage]);
      scrollToBottom();
    });
    return () => {
      console.log("Disconnect handler");
      handler.disconnect();
    };
  }, [socket, setMessages]);

  scrollToBottom();

  return (
    <ul
      ref={listRef}
      className="flex h-[700px] w-96 flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-y-scroll"
    >
      {messages.map((message) => {
        return (
          <MessageBox
            key={message.id}
            messsage={message}
            user={message.user}
            onClick={async (message) =>
              socket?.emit("event", `Message ping: ${message.message}`)
            }
          />
        );
      })}
      <div ref={bottomLineRef}></div>
    </ul>
  );
}
