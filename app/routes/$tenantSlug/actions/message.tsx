import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { UpdateStatus } from "~/controllers.ts/action.server";
import { Status } from "@prisma/client";
import { getMessage } from "~/models/message.server";
import { GetAdmin } from "~/controllers.ts/tenantUser.server";
import { GetTenant } from "~/middleware/tenant";

export const validator = withZod(
  z.object({
    messageId: z.string().cuid({ message: "MessageId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    reasonInformation: z.string().optional(),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const tenant = await GetTenant(params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const { messageId, reasonId, reasonInformation, status } = res.data;
  const message = await getMessage(tenant, messageId);
  if (!message) {
    throw new Error(`Could not find message: ${messageId}`);
  }
  const admin = await GetAdmin();
  await UpdateStatus(
    tenant,
    admin,
    status,
    reasonId,
    reasonInformation,
    message
  );
  const newMessage = await getMessage(tenant, messageId);
  return json({ message: newMessage });
};
