import type { FlowChildJob } from "bullmq";
import { Queue } from "../app/queue.server";

export type QueueData = {
  imageId: string;
  imageURL: string;
  tenantId: string;
};

export const imageOCRQueue = Queue<QueueData>("image-ocr");

export function newImageOCRQueueJob(data: QueueData): FlowChildJob {
  return {
    name: "image-ocr",
    data: {
      imageId: data.imageId,
      imageURL: data.imageURL,
      tenantId: data.tenantId,
    } as QueueData,
    queueName: imageOCRQueue.name,
    opts: { jobId: data.imageId },
  };
}
