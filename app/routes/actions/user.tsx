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
import { db } from "~/db.server";
import { Status } from "@prisma/client";
import { getUserById } from "~/models/user.server";

export const validator = withZod(
  z.object({
    userId: z.string().cuid({ message: "userId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    extraInformation: z.string().optional(),
    allowAllMessages: zx.CheckboxAsString,
    flagAllMessages: zx.CheckboxAsString,
    hideAllMessages: zx.CheckboxAsString,
  })
);

export const action: ActionFunction = async ({ request }) => {
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const {
    userId,
    reasonId,
    extraInformation,
    status,
    allowAllMessages,
    flagAllMessages,
    hideAllMessages,
  } = res.data;
  if (flagAllMessages && hideAllMessages) {
    throw new Error("Cannot flag and hide all messages at the same time");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error(`Could not find user: ${user}`);
  } else if (user.status === status) {
    return json({ user });
  }

  const admin = await db.admin.findFirstOrThrow();
  await UpdateStatus(
    admin,
    status,
    reasonId,
    extraInformation,
    undefined,
    userId
  );
  const updatedUser = await getUserById(userId);
  if (allowAllMessages || flagAllMessages || hideAllMessages) {
    const status: Status = allowAllMessages
      ? "allowed"
      : flagAllMessages
      ? "flagged"
      : "hidden";
    await UpdateMessagesStatus(
      admin,
      status,
      reasonId,
      userId,
      extraInformation
    );
  }

  return json({ user: updatedUser });
};
