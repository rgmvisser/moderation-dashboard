import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { GetAuthenticatedAPIKey } from "~/middleware/authenticate";
import type { Tenant } from "@prisma/client";
import { UserController } from "~/controllers.ts/user.server";
import { SignInMethodForString } from "~/models/user";
import { ContentController } from "~/controllers.ts/content.server";
import { ProjectController } from "~/controllers.ts/project.server";
import { TopicController } from "~/controllers.ts/topic.server";
import invariant from "tiny-invariant";
import type { ContentWithInfo } from "~/models/content";
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
  let user = await userController.getUserByExternalId(data.user.id);
  if (!user) {
    const name = data.user.name ?? UserController.RandomName();
    user = await userController.createUser({
      externalId: data.user.id,
      createdAt: data.user.created_at,
      name,
      signInMethod: SignInMethodForString(data.user.signup_method ?? "unknown"),
      emailDomain: data.user.email_domain,
      status: "allowed",
      location: data.user.location,
    });
  } else {
    user = await userController.updateUser({
      user,
      name: data.user.name,
      signInMethod: data.user.signup_method
        ? SignInMethodForString(data.user.signup_method)
        : undefined,
      location: data.user.location,
      emailDomain: data.user.email_domain,
    });
  }
  invariant(user, "User should exist");

  /// Section 2: Create the project
  const projectController = new ProjectController(tenant);
  let project = await projectController.getProjectByExternalId(data.project.id);
  if (!project) {
    project = await projectController.createProject(
      data.project.name,
      data.project.id
    );
  } else {
    if (project.name !== data.project.name) {
      project = await projectController.updateProject(
        project,
        data.project.name
      );
    }
  }
  invariant(project, "Project should exist");

  /// Section 3: Create the topic
  const topicController = new TopicController(tenant);
  let topic = await topicController.getTopicByExternalId(data.topic.id);
  if (!topic) {
    topic = await topicController.createTopic(
      data.topic.name,
      data.topic.id,
      project
    );
  } else {
    if (topic.name !== data.topic.name) {
      topic = await topicController.updateTopic(topic, data.topic.name);
    }
  }
  invariant(topic, "Topic should exist");

  /// Section 4: Create the content
  const contentController = new ContentController(tenant);
  let content: ContentWithInfo | null = null;
  if (data.message) {
    content = await contentController.getContentByExternalId(data.message.id);
    if (!content) {
      content = await contentController.createContent(user, project, topic, {
        externalId: data.message.id,
        createdAt: data.message.created_at,
        message_text: data.message.text,
      });
    } else {
      content = await contentController.updateContent(content, {
        text: data.message.text,
      });
    }
  } else if (data.image) {
    content = await contentController.getContentByExternalId(data.image.id);
    if (!content) {
      content = await contentController.createContent(user, project, topic, {
        externalId: data.image.id,
        createdAt: data.image.created_at,
        message_text: data.image.url,
      });
    } else {
      content = await contentController.updateContent(content, {
        image_url: data.image.url,
      });
    }
  }
  invariant(content, "Content should exist");

  return json({ contentId: content?.id });
};
