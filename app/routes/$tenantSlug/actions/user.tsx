import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import {
  UpdateMessagesStatus,
  UpdateStatus,
} from "~/controllers.ts/action.server";

import { Status } from "@prisma/client";
import { getUserById } from "~/models/user.server";
import { getGeneralClient } from "~/db.server";
import { GetAdmin } from "~/controllers.ts/tenantUser.server";
import { GetTenant } from "~/middleware/tenant";

export const validator = withZod(
  z.object({
    userId: z.string().cuid({ message: "userId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    reasonInformation: z.string().optional(),
    allowAllMessages: zx.CheckboxAsString,
    flagAllMessages: zx.CheckboxAsString,
    hideAllMessages: zx.CheckboxAsString,
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const tenant = await GetTenant(params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const {
    userId,
    reasonId,
    reasonInformation,
    status,
    allowAllMessages,
    flagAllMessages,
    hideAllMessages,
  } = res.data;
  if (flagAllMessages && hideAllMessages) {
    throw new Error("Cannot flag and hide all messages at the same time");
  }
  const user = await getUserById(tenant, userId);
  if (!user) {
    throw new Error(`Could not find user: ${user}`);
  }

  const admin = await GetAdmin();
  await UpdateStatus(
    tenant,
    admin,
    status,
    reasonId,
    reasonInformation,
    undefined,
    user
  );
  const updatedUser = await getUserById(tenant, userId);
  if (allowAllMessages || flagAllMessages || hideAllMessages) {
    const status: Status = allowAllMessages
      ? "allowed"
      : flagAllMessages
      ? "flagged"
      : "hidden";
    await UpdateMessagesStatus(
      tenant,
      admin,
      status,
      reasonId,
      userId,
      reasonInformation
    );
  }

  return json({ user: updatedUser });
};
