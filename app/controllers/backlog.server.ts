import { ioServer } from "server";
import { getTenantClient, getGeneralClient } from "~/db.server";
import { FilterController } from "~/controllers/filter.server";

import { intervalTimer } from "./timer.server";
import { ContentController } from "./content.server";
import { ContentWithInfo } from "~/models/content";
import { randomUUID } from "crypto";

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
  const moderator = await getGeneralClient().moderator.findFirstOrThrow({
    include: { roles: { include: { tenant: true } } },
  });
  const tenant = moderator.roles[0].tenant;
  const db = getTenantClient(tenant);
  // console.log("Updating backlog: ", time);
  if (!lastTime) {
    // Find the last content so we can continue from there on server restart
    const lastContent = await db.content.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (lastContent) {
      lastTime = lastContent.millisecondsAfterStart;
      intervalTimer.setTime(lastContent.millisecondsAfterStart);
      return;
    } else {
      lastTime = 0;
    }
  }
  // console.log("Lasttime: ", lastTime);
  // console.log("New time: ", time);

  // Move backlog contents to contents
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
  console.log("Found backlog contents:", backlogMessages.length);
  lastTime = time; // Update time to last fetched

  const filterController = new FilterController(tenant, moderator);
  const filter = await filterController.getModeratorFilter();

  // Create contents and emit them
  for (const bm of backlogMessages) {
    const data = {
      ...bm,
      tenantId: tenant.id,
      id: undefined,
      createdAt: undefined,
      updateAt: undefined,
      externalId: randomUUID(),
    };
    const createdContent = await db.content.create({
      data: data,
    });
    const contentController = new ContentController(tenant);
    const m: ContentWithInfo | null = await contentController.getContent(
      createdContent.id,
      filter
    );
    if (m) {
      ioServer.emit("new-content", JSON.stringify({ content: m }));
    }
  }
}
