import type { Job } from "bullmq";
import { Worker } from "bullmq";
import type { QueueData } from "queues/aws-rekognition.server";
import { getGeneralClient } from "~/db.server";
import { logger } from "~/logger";
import redis from "~/redis.server";
import axios from "axios";

export const worker = new Worker(
  "image-ocr",
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
        ocr: true,
      },
    });
    if (!image) return;
    if (image.ocr) return;

    const imageOCR = await db.imageOCR.findUnique({
      where: { url: imageURL },
    });
    if (imageOCR) return;

    const imageBlob = await downloadImageBlob(imageURL);
    if (!imageBlob) return;

    let text = "";
    const time = new Date().getTime();
    try {
      const res = await axios.post(
        process.env.AWS_OCR_ENDPOINT ?? "",
        {
          image64: imageBlob.toString("base64"),
          tess_params: {
            psm: 3,
            oem: 3,
            lang: "eng",
          },
          usepil: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const ocr = res.data;
      if (ocr.statusCode !== 200) {
        logger.error("Error when doing OCR on image, not returning 200:", ocr);
        return null;
      }
      const result = JSON.parse(ocr.body);
      text = result.ocr_text;
    } catch (err) {
      logger.error("Error when doing OCR on image: ", err);
      return;
    }
    const time2 = new Date().getTime();
    const duration = time2 - time;

    await db.imageOCR.create({
      data: {
        tenantId: tenant.id,
        url: imageURL,
        text: text,
        processTime: duration,
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
