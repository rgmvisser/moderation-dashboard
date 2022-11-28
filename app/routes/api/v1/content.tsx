import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { json } from "remix-supertyped";

import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { ActionController } from "~/controllers.ts/action.server";

import { GetModeratorAndTenant } from "~/middleware/tenant";
import { ContentController } from "~/controllers.ts/content.server";

export const validator = withZod(
  z.object({
    user: z.object({
      id: z.string(),
      created_at: z.date(),
      name: z.string().optional(),
      email_domain: z.string().optional(),
      signup_method: z.string().optional(),
      profile_image_url: z.string().optional(),
    }),
    content: z
      .object({
        id: z.string(),
        created_at: z.date(),
        content: z.string(),
      })
      .optional(),
    image: z
      .object({
        image_id: z.string(),
        created_at: z.date(),
        image_url: z.string().url(),
      })
      .optional(),
    project: z.object({
      id: z.string(),
      name: z.string(),
    }),
    topic: z.object({
      id: z.string(),
      name: z.string(),
    }),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  // const { tenant, moderator } = await GetModeratorAndTenant(request, params);
  // const res = await validator.validate(await request.formData());
  // if (res.error) {
  //   return validationError(res.error);
  // }
  // const { contentId, reasonId, reasonInformation, status } = res.data;
  // const contentController = new ContentController(tenant);
  // const content = await contentController.getContent(contentId);
  // if (!content) {
  //   throw new Error(`Could not find content: ${contentId}`);
  // }
  // const actionController = new ActionController(tenant);
  // await actionController.updateStatus(
  //   moderator,
  //   status,
  //   reasonId,
  //   reasonInformation,
  //   content
  // );
  // const newContent = await contentController.getContent(contentId);
  // return json({ content: newContent });
};
