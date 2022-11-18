import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { UpdateStatus } from "~/controllers.ts/action.server";
import { db } from "~/db.server";
import { Status } from "@prisma/client";
import { getMessage } from "~/models/message.server";

export const validator = withZod(
  z.object({
    messageId: z.string().cuid({ message: "MessageId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    extraInformation: z.string().optional(),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const { messageId, reasonId, extraInformation, status } = res.data;
  const message = await getMessage(messageId);
  if (!message) {
    throw new Error(`Could not find message: ${messageId}`);
  } else if (message.status === status) {
    return json({ message });
  }

  const admin = await db.admin.findFirstOrThrow();
  await UpdateStatus(admin, status, reasonId, extraInformation, messageId);
  const newMessage = await getMessage(messageId);
  return json({ message: newMessage });
};
