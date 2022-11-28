import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { ActionController } from "~/controllers.ts/action.server";

import { Status } from "@prisma/client";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import { UserController } from "~/controllers.ts/user.server";

export const validator = withZod(
  z.object({
    userId: z.string().cuid({ message: "userId required" }),
    reasonId: z.string().cuid({ message: "Please fill out a reason" }),
    status: z.nativeEnum(Status),
    reasonInformation: z.string().optional(),
    allowAllContents: zx.CheckboxAsString,
    flagAllContents: zx.CheckboxAsString,
    hideAllContents: zx.CheckboxAsString,
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const { tenant, moderator } = await GetModeratorAndTenant(request, params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const {
    userId,
    reasonId,
    reasonInformation,
    status,
    allowAllContents,
    flagAllContents,
    hideAllContents,
  } = res.data;
  if (flagAllContents && hideAllContents) {
    throw new Error("Cannot flag and hide all contents at the same time");
  }
  const userController = new UserController(tenant);
  const user = await userController.getUserById(tenant, userId);
  if (!user) {
    throw new Error(`Could not find user: ${user}`);
  }
  const actionController = new ActionController(tenant);
  await actionController.updateStatus(
    moderator,
    status,
    reasonId,
    reasonInformation,
    undefined,
    user
  );
  const updatedUser = await userController.getUserById(tenant, userId);
  if (allowAllContents || flagAllContents || hideAllContents) {
    const status: Status = allowAllContents
      ? "allowed"
      : flagAllContents
      ? "flagged"
      : "hidden";
    const actionController = new ActionController(tenant);

    await actionController.updateContentsStatus(
      moderator,
      status,
      reasonId,
      userId,
      reasonInformation
    );
  }

  return json({ user: updatedUser });
};
