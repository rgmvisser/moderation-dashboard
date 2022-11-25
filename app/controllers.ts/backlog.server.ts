import { ioServer } from "server";
import { getTenantClient, getGeneralClient } from "~/db.server";
import { GetAdminFilter } from "~/models/filter.server";
import type { MessageWithInfo } from "~/models/message.server";
import { getMessage } from "~/models/message.server";
import { GetAdmin } from "./tenantUser.server";
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
  const admin = await GetAdmin();
  const tenant = admin.tenant;
  // console.log("Updating backlog: ", time);
  if (!lastTime) {
    // Find the last message so we can continue from there on server restart
    const lastMessage = await getTenantClient(tenant).message.findFirst({
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
  const backlogMessages = await getGeneralClient().backlogMessage.findMany({
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

  const filter = await GetAdminFilter(tenant);

  // Create messages and emit them
  for (const bm of backlogMessages) {
    const data = {
      ...bm,
      tenantId: tenant.id,
      id: undefined,
      createdAt: undefined,
      updateAt: undefined,
    };
    const createdMessage = await getTenantClient(tenant).message.create({
      data: data,
    });
    const m: MessageWithInfo | null = await getMessage(
      tenant,
      createdMessage.id,
      filter
    );
    if (m) {
      ioServer.emit("new-message", JSON.stringify({ message: m }));
    }
  }
}
