import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { ioServer } from "server";
import { ContentController } from "~/controllers/content.server";
import { FilterController } from "~/controllers/filter.server";
import { ModeratorController } from "~/controllers/moderator.server";
import { getGeneralClient } from "~/db.server";
import redis from "~/redis.server";

export const worker = new Worker(
  "socket",
  async (job: Job) => {
    const { contentId, tenantId } = job.data;

    const tenant = await getGeneralClient().tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) return;
    // Send the content to the moderator that are online
    const moderatorController = new ModeratorController(tenant);
    const moderators = await moderatorController.getAllModerators();
    const rooms = ioServer.sockets.adapter.rooms;
    const onlineModerators = moderators.filter((m) => rooms.has(m.id));
    if (onlineModerators.length === 0) return;
    // console.log(`Found ${onlineModerators.length} online moderators`);
    const contentController = new ContentController(tenant);
    await Promise.all(
      onlineModerators.map(async (moderator) => {
        // Only send it to themes that are not filtered
        const filterController = new FilterController(tenant, moderator);
        const filter = await filterController.getModeratorFilter();
        const content = await contentController.getContent(contentId, filter);
        if (content) {
          ioServer.emit("new-content", JSON.stringify({ content: content }));
          //   console.log("Send new content to moderator", moderator.id);
        } else {
          //   console.log("Moderator not watching content", moderator.id);
        }
      })
    );
  },
  {
    connection: redis,
    concurrency: 1,
  }
);
