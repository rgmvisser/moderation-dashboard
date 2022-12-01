import { Queue } from "../app/queue.server";

type QueueData = {
  contentId: string;
  tenantId: string;
};

export const socketQueue = Queue<QueueData>("socket");
