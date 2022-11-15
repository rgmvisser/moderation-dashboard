import type { LoaderArgs } from "@remix-run/node";
import { useCallback, useEffect, useRef, useState } from "react";
import { json, useLoaderData } from "remix-supertyped";
import type { MessageWithInfo } from "~/models/message.server";
import { getMessages } from "~/models/message.server";
import MessageBox from "~/shared/components/MessageBox";
import { useSocket } from "~/shared/contexts/SocketContext";
import { JSONParseWithDates } from "~/shared/utils.tsx/json";
import { Outlet, useParams } from "@remix-run/react";
import { DashboardContainer } from "~/shared/components/DashboardContainer";

export async function loader({ request }: LoaderArgs) {
  const messages = await getMessages();
  messages.reverse(); // to make sure the messages are at the bottom
  return json({ messages });
}

export default function Messages() {
  const params = useParams();
  const currentMessageId = params["messageId"];
  const data = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState<MessageWithInfo[]>(
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
        .message as MessageWithInfo;
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
    <div className="flex h-[840px] flex-row items-stretch justify-items-stretch gap-4">
      <DashboardContainer className="overflow-y-scroll">
        <ul className="w-full" ref={listRef} onWheel={onWheel}>
          {messages.map((message) => {
            return (
              <MessageBox
                key={message.id}
                messsage={message}
                project={message.project}
                thread={message.thread}
                user={message.user}
                selected={currentMessageId === message.id}
              />
            );
          })}
          <div ref={bottomLineRef}></div>
        </ul>
      </DashboardContainer>
      <Outlet />
    </div>
  );
}
