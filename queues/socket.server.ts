import type { FlowChildJob } from "bullmq";
import { Queue } from "../app/queue.server";

type QueueData = {
  contentId: string;
  tenantId: string;
};

export const socketQueue = Queue<QueueData>("socket");

export function newSocketQueueJob(data: QueueData): FlowChildJob {
  return {
    name: "scan-image",
    data: {
      contentId: data.contentId,
      tenantId: data.tenantId,
    } as QueueData,
    queueName: socketQueue.name,
    opts: { jobId: data.contentId },
  };
}
