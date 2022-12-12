import type { Job } from "bullmq";
import { Worker } from "bullmq";
import type { QueueData } from "queues/aws-rekognition.server";
import { getGeneralClient } from "~/db.server";
import { logger } from "~/logger";
import redis from "~/redis.server";
import type { DetectModerationLabelsCommandOutput } from "@aws-sdk/client-rekognition";
import { Rekognition } from "@aws-sdk/client-rekognition";

export const worker = new Worker(
  "aws-rekognition",
  async (job: Job) => {
    const db = getGeneralClient();
    const { imageId, tenantId, imageURL } = job.data as QueueData;

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) return;
    const image = await db.image.findUnique({
      where: { id: imageId },
      include: {
        awsModerationResult: true,
      },
    });
    if (!image) return;
    if (image.awsModerationResult) return;

    const awsResult = await db.aWSModerationResult.findUnique({
      where: { url: imageURL },
    });
    if (awsResult) return;

    const imageBlob = await downloadImageBlob(imageURL);
    if (!imageBlob) return;

    const rekognition = new Rekognition({
      region: "eu-west-1",
    });
    let output: DetectModerationLabelsCommandOutput;
    const time = new Date().getTime();
    try {
      output = await rekognition.detectModerationLabels({
        Image: {
          Bytes: imageBlob,
        },
        MinConfidence: 1,
      });
    } catch (err) {
      logger.error("Error detecting labels on image: ", err);
      return;
    }
    const timeDone = new Date().getTime();
    const labelNames =
      output.ModerationLabels?.map((label) => label.Name) ?? [];
    let highestConfidenceScore = 0;
    let highestConfidenceLabel = "";
    let averageConfidenceScore = 0;
    let labels = 0;
    let totalScore = 0;
    for (const label of output.ModerationLabels ?? []) {
      if (!label.Confidence) continue;
      if ((label.Confidence ?? 0) > highestConfidenceScore) {
        highestConfidenceScore = label.Confidence;
        highestConfidenceLabel = label.Name ?? "";
      }
      totalScore += label.Confidence;
      labels++;
    }
    averageConfidenceScore = labels > 0 ? totalScore / labels : 0;
    await db.aWSModerationResult.create({
      data: {
        tenantId: tenant.id,
        url: imageURL,
        labels: JSON.stringify(output.ModerationLabels ?? []),
        processTime: timeDone - time,
        labelNames: JSON.stringify(labelNames),
        highestConfidenceScore: highestConfidenceScore,
        highestConfidenceLabel: highestConfidenceLabel,
        averageConfidenceScore: averageConfidenceScore,
      },
    });
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

async function downloadImageBlob(imageURL: string) {
  return fetch(imageURL)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      return Buffer.from(buffer);
      // Do something with the image blob
    })
    .catch((err) => {
      logger.error("Error downloading image blob: ", err);
      return null;
    });
}
