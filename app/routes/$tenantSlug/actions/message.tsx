import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { ActionController } from "~/controllers.ts/action.server";
import { Status } from "@prisma/client";

import { GetModeratorAndTenant } from "~/middleware/tenant";
import { MessageController } from "~/controllers.ts/message.server";

export const validator = withZod(
  z.object({
    messageId: z.string().cuid({ message: "MessageId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    reasonInformation: z.string().optional(),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const { tenant, moderator } = await GetModeratorAndTenant(request, params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const { messageId, reasonId, reasonInformation, status } = res.data;
  const messageController = new MessageController(tenant);
  const message = await messageController.getMessage(messageId);
  if (!message) {
    throw new Error(`Could not find message: ${messageId}`);
  }
  const actionController = new ActionController(tenant);
  await actionController.updateStatus(
    moderator,
    status,
    reasonId,
    reasonInformation,
    message
  );
  const newMessage = await messageController.getMessage(messageId);
  return json({ message: newMessage });
};
