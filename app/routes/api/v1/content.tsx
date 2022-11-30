import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { GetAuthenticatedAPIKey } from "~/middleware/authenticate";
import type { Content, Tenant } from "@prisma/client";
import { UserController } from "~/controllers/user.server";
import { SignInMethodForString } from "~/models/user";
import { ContentController } from "~/controllers/content.server";
import { ProjectController } from "~/controllers/project.server";
import { TopicController } from "~/controllers/topic.server";
import invariant from "tiny-invariant";
import isISODate from "is-iso-date";

const isoDate = z
  .string()
  .refine(isISODate, { message: "Not a valid ISO string date " })
  .transform((string) => new Date(string));

export const validator = withZod(
  z.object({
    user: z.object({
      id: z.string(),
      created_at: isoDate,
      name: z.string().optional(),
      location: z.string().optional(),
      email_domain: z.string().optional(),
      signup_method: z.string().optional(),
      profile_image_url: z.string().optional(),
    }),
    message: z
      .object({
        id: z.string(),
        created_at: isoDate,
        text: z.string(),
      })
      .optional(),
    image: z
      .object({
        id: z.string(),
        created_at: isoDate,
        url: z.string().url(),
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

export const action: ActionFunction = async ({ request }) => {
  let tenant: Tenant;
  try {
    const apiKey = await GetAuthenticatedAPIKey(request);
    tenant = apiKey.tenant;
  } catch (error: any) {
    return json({ error: error.message }, { status: 401 });
  }
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch (error: any) {
    console.log(error);
    return json({ error: "Invalid JSON" }, { status: 400 });
  }
  const res = await validator.validate(body);
  if (res.error) {
    return json({ error: res.error.fieldErrors }, { status: 400 });
  }
  const data = res.data;
  if (!data.message && !data.image) {
    return json(
      { error: "Please provide a message or an image" },
      { status: 400 }
    );
  }
  if (data.message && data.image) {
    return json(
      { error: "Please provide a message or an image, not both" },
      { status: 400 }
    );
  }

  /// Section 1: Create the user
  const userController = new UserController(tenant);
  const name = data.user.name ?? UserController.RandomName();
  const user = await userController.upsertUser({
    externalId: data.user.id,
    createdAt: data.user.created_at,
    name,
    signInMethod: SignInMethodForString(data.user.signup_method ?? "unknown"),
    emailDomain: data.user.email_domain,
    status: "allowed",
    location: data.user.location,
  });

  /// Section 2: Create the project
  const projectController = new ProjectController(tenant);
  const project = await projectController.upsertProject(
    data.project.name,
    data.project.id
  );

  /// Section 3: Create the topic
  const topicController = new TopicController(tenant);
  const topic = await topicController.upsertTopic(
    data.topic.name,
    data.topic.id,
    project
  );

  /// Section 4: Create the content
  const contentController = new ContentController(tenant);
  let content: Content | null = null;
  if (data.message) {
    content = await contentController.upsertContent(user, project, topic, {
      externalId: data.message.id,
      createdAt: data.message.created_at,
      message_text: data.message.text,
    });
  } else if (data.image) {
    content = await contentController.upsertContent(user, project, topic, {
      externalId: data.image.id,
      createdAt: data.image.created_at,
      message_text: data.image.url,
    });
  }
  invariant(content, "Content should exist");

  return json({ contentId: content.id });
};
