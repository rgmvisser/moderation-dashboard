import { json } from "remix-supertyped";
import { ioServer } from "server";
import { db } from "~/db.server";
import { GetAdminFilter, GetFilterInfo } from "~/models/filter.server";
import { getMessage, MessageWithInfo } from "~/models/message.server";
import { intervalTimer } from "./timer.server";

export function startBacklogQueue() {
  intervalTimer.setListener(async ({ time }) => {
    try {
      console.log("Received time");
      await updateBacklog(time);
    } catch (err) {
      console.log("Error updating time: ", err);
    }
  });
}

let lastTime: number;
async function updateBacklog(time: number) {
  // console.log("Updating backlog: ", time);
  if (!lastTime) {
    // Find the last message so we can continue from there on server restart
    const lastMessage = await db.message.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (lastMessage) {
      lastTime = lastMessage.millisecondsAfterStart;
      intervalTimer.setTime(lastMessage.millisecondsAfterStart);
      return;
    } else {
      lastTime = 0;
    }
  }
  // console.log("Lasttime: ", lastTime);
  // console.log("New time: ", time);

  // Move backlog messages to messages
  const backlogMessages = await db.backlogMessage.findMany({
    where: {
      millisecondsAfterStart: {
        gt: lastTime,
        lte: time,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log("Found backlog messages:", backlogMessages.length);
  lastTime = time; // Update time to last fetched

  const filter = await GetAdminFilter();

  // Create messages and emit them
  for (const bm of backlogMessages) {
    const data = {
      ...bm,
      id: undefined,
      createdAt: undefined,
      updateAt: undefined,
    };
    const createdMessage = await db.message.create({
      data: data,
    });
    const m: MessageWithInfo | null = await getMessage(
      createdMessage.id,
      filter
    );
    if (m) {
      ioServer.emit("new-message", JSON.stringify({ message: m }));
    }
  }
}
