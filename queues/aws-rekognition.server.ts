import type { FlowChildJob } from "bullmq";
import { Queue } from "../app/queue.server";

export type QueueData = {
  imageId: string;
  imageURL: string;
  tenantId: string;
};

export const awsRekognitionQueue = Queue<QueueData>("aws-rekognition");

export function newAWSRekognitionQueueJob(data: QueueData): FlowChildJob {
  return {
    name: "scan-image",
    data: {
      imageId: data.imageId,
      imageURL: data.imageURL,
      tenantId: data.tenantId,
    } as QueueData,
    queueName: awsRekognitionQueue.name,
    opts: { jobId: data.imageId },
  };
}
