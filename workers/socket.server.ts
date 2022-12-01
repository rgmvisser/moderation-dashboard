import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { ioServer } from "server";
import { ContentController } from "~/controllers/content.server";
import { getGeneralClient, getTenantClient } from "~/db.server";
import redis from "~/redis.server";

export const worker = new Worker(
  "socket",
  async (job: Job) => {
    const { contentId, tenantId } = job.data;

    const tenant = await getGeneralClient().tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) return;
    console.log(`Pushing new content ${job.data.contentId}`);
    const contentController = new ContentController(tenant);
    const content = await contentController.getContent(contentId);
    ioServer.emit("new-content", JSON.stringify({ content: content }));
    console.log(`New content pushed ${job.data.contentId}`);
  },
  {
    connection: redis,
    concurrency: 1,
  }
);

console.log("Here!");
