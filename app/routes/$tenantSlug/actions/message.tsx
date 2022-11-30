import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { ActionController } from "~/controllers/action.server";
import { Status } from "@prisma/client";

import { GetModeratorAndTenant } from "~/middleware/tenant";
import { ContentController } from "~/controllers/content.server";

export const validator = withZod(
  z.object({
    contentId: z.string().cuid({ message: "ContentId required" }),
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
  const { contentId, reasonId, reasonInformation, status } = res.data;
  const contentController = new ContentController(tenant);
  const content = await contentController.getContent(contentId);
  if (!content) {
    throw new Error(`Could not find content: ${contentId}`);
  }
  const actionController = new ActionController(tenant);
  await actionController.updateStatus(
    moderator,
    status,
    reasonId,
    reasonInformation,
    content
  );
  const newContent = await contentController.getContent(contentId);
  return json({ content: newContent });
};
