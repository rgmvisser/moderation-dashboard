import type { Message, User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { json, useLoaderData } from "remix-supertyped";
import { db } from "~/db.server";
import MessageBox from "~/shared/components/MessageBox";
import { useSocket } from "~/shared/contexts/SocketContext";
import { JSONParseWithDates } from "~/shared/utils.tsx/json";

type MessageWithUser = Message & { user: User };

export async function loader({ request }: LoaderArgs) {
  const messages = await db.message.findMany({
    take: 30,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  messages.reverse(); // to make sure the messages are at the bottom
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
  const scrolling = useRef(false);
  const shouldDoLastScroll = useRef(false);
  const prevScroll = useRef(0);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (!bottomLineRef.current || !listRef.current) {
      return;
    }

    if (shouldAutoScroll.current) {
      if (!scrolling.current) {
        scrolling.current = true;
        bottomLineRef.current.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          scrolling.current = false;
          if (shouldDoLastScroll.current) {
            shouldDoLastScroll.current = false;
            scrollToBottom();
          }
        }, 500);
      } else {
        shouldDoLastScroll.current = true;
      }
    }
  }, [bottomLineRef, listRef, scrolling, shouldDoLastScroll]);

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
  }, [socket, setMessages, scrollToBottom]);

  scrollToBottom();

  function onWheel(event: any) {
    const scrollY = listRef.current?.scrollTop ?? 0;
    if (prevScroll.current === scrollY && scrollY !== 0) {
      console.log("at the bottom:", shouldAutoScroll.current);
      // Scrolled to the bottom
      shouldAutoScroll.current = true;
    } else {
      // Scrolling not at the bottom
      shouldAutoScroll.current = false;
    }
    prevScroll.current = scrollY;
  }

  return (
    <div className="flex h-[840px]">
      <ul
        ref={listRef}
        className="flex w-1/3 flex-col items-start justify-start overflow-y-scroll bg-white"
        onWheel={onWheel}
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

      <div className="w-2/3 bg-slate-500"></div>
      {/* <Outlet /> */}
    </div>
  );
}
