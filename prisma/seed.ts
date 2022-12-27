import type { Tenant } from "@prisma/client";
import { PrismaClient, RuleType, SignInMethod, Status } from "@prisma/client";
import { randomUUID } from "crypto";
import randomSentence from "random-sentence";
import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import { ContentController } from "~/controllers/content.server";
import { ModeratorController } from "~/controllers/moderator.server";

const nameConfig: Config = {
  dictionaries: [names],
};

const prisma = new PrismaClient();

async function seed() {
  const t = await prisma.tenant.findFirstOrThrow();
  await createRules(t);

  return;
  await prisma.tenant.deleteMany(); // Everything should cascade
  await prisma.backlogMessage.deleteMany();

  const tenant = await prisma.tenant.create({
    data: {
      name: "Woov",
      slug: "woov",
    },
  });

  ModeratorController.CreateModerator(tenant, {
    name: "Ruud Visser",
    email: "visser.rgm@gmail.com",
    password: "password",
    avatar:
      "https://en.gravatar.com/userimage/61402465/c8cdd02ae2207b22c6582d7716e5e8b0.jpeg",
    role: "admin",
  });
  ModeratorController.CreateModerator(tenant, {
    name: "Sebas Westerduin",
    email: "sebas@woovapp.com",
    password: "password",
    role: "admin",
  });

  // Created reasons per status
  await prisma.reason.createMany({
    data: [
      {
        tenantId: tenant.id,
        name: "Explicit Nudity",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Suggestive",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Violence",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Visually Disturbing",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Rude Gestures",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Drugs",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Tobacco",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Alcohol",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Gambling",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Hate Symbols",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Other",
        statuses: [Status.flagged, Status.hidden],
      },
      {
        tenantId: tenant.id,
        name: "Inaccurate flag",
        statuses: [Status.allowed],
      },
      {
        tenantId: tenant.id,
        name: "Inaccurate hide",
        statuses: [Status.allowed],
      },
    ],
  });

  // Create contents
  const numContents = 10000;
  const numUsers = 100;

  const projects = ["Mysterlyland"];
  const topics = ["Main Stage", "Deephouse", "Food court", "Campground"];

  // 10 times as many flagged/hidden contents
  const statuses = Array(10).fill(Status.allowed);
  statuses.push(Status.flagged);
  statuses.push(Status.hidden);

  // Create users
  const locations = [
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Amsterdam",
    "Barcelona",
    "Nigeria",
  ];
  const signInMethods = [
    SignInMethod.email,
    SignInMethod.email,
    SignInMethod.email,
    SignInMethod.google,
    SignInMethod.facebook,
  ];

  await prisma.project.createMany({
    data: projects.map((project) => {
      return {
        tenantId: tenant.id,
        name: project,
        externalId: randomId(),
      };
    }),
  });
  const projectIds = (
    await prisma.project.findMany({ select: { id: true } })
  ).map((obj) => obj.id);

  await prisma.topic.createMany({
    data: topics.map((topic) => {
      return {
        tenantId: tenant.id,
        projectId: sample(projectIds),
        name: topic,
        externalId: randomId(),
      };
    }),
  });
  const topicIds = (await prisma.topic.findMany({ select: { id: true } })).map(
    (obj) => obj.id
  );

  await prisma.user.createMany({
    data: Array.from(Array(numUsers).keys()).map((num) => {
      return {
        tenantId: tenant.id,
        name: uniqueNamesGenerator(nameConfig),
        location: sample(locations),
        signInMethod: sample(signInMethods),
        status: sample(statuses),
        externalId: randomId(),
      };
    }),
  });

  const userIds = (
    await prisma.user.findMany({
      select: {
        id: true,
      },
      take: numUsers,
    })
  ).map((obj) => obj.id);

  let timeMiliseconds = 0;
  const timeMilisecondsOptions = [
    10, 20, 50, 100, 200, 500, 10, 20, 50, 100, 200, 500, 200, 500, 1000, 2000,
    5000,
  ];
  const randomTimes: number[] = [];
  for (let i = 0; i < numContents; i++) {
    timeMiliseconds += sample(timeMilisecondsOptions);
    randomTimes.push(timeMiliseconds);
  }

  // Create backlog contents
  await prisma.backlogMessage.createMany({
    data: Array.from(Array(numContents).keys()).map((num) => {
      return {
        content: randomSentence({ min: 1, max: 250 }),
        userId: sample(userIds),
        millisecondsAfterStart: randomTimes[num],
        topicId: sample(topicIds),
        projectId: sample(projectIds),
        status: sample(statuses),
      };
    }),
  });

  await createRules(tenant);

  console.log(`Database has been seeded. 🌱`);
}

async function createRules(tenant: Tenant) {
  const internalReason = await createRuleReason(tenant, "Internal", [
    Status.allowed,
  ]);
  const inheritUserReason = await createRuleReason(
    tenant,
    "Inherit from user",
    [Status.allowed, Status.hidden, Status.flagged]
  );
  const inappropriateContentReason = await createRuleReason(
    tenant,
    "Inappropriate content",
    [Status.flagged, Status.hidden]
  );
  await prisma.rule.create({
    data: {
      tenantId: tenant.id,
      name: "Always approve admin content",
      description: "Always approve content from admins",
      type: RuleType.content,
      terminateOnMatch: true,
      conditions: {
        create: {
          tenantId: tenant.id,
        },
      },
      reasonId: internalReason.id,
      action: Status.allowed,
      order: 0,
    },
  });
  await prisma.rule.create({
    data: {
      tenantId: tenant.id,
      name: "Flag if user is flagged",
      description: "When the user is flagged we should also flag the content",
      type: RuleType.content,
      skipIfAlreadyApplied: true,
      conditions: {
        create: {
          tenantId: tenant.id,
        },
      },
      reasonId: inheritUserReason.id,
      action: Status.flagged,
      order: 1,
    },
  });
  await prisma.rule.create({
    data: {
      tenantId: tenant.id,
      name: "Hide if user is hidden",
      description: "When the user is hidden we should also hide the content",
      type: RuleType.content,
      skipIfAlreadyApplied: true,
      terminateOnMatch: true,
      conditions: {
        create: {
          tenantId: tenant.id,
        },
      },
      reasonId: inheritUserReason.id,
      action: Status.hidden,
      order: 2,
    },
  });
  await prisma.rule.create({
    data: {
      tenantId: tenant.id,
      name: "Flag content with bad words",
      description: "When the content has bad words we should flag it",
      type: RuleType.content,
      skipIfAlreadyApplied: true,
      conditions: {
        create: {
          tenantId: tenant.id,
        },
      },
      reasonId: inappropriateContentReason.id,
      action: Status.flagged,
      order: 3,
    },
  });
}

async function createRuleReason(
  tenant: Tenant,
  name: string,
  statusList: Status[]
) {
  const reason = await prisma.reason.findUnique({
    where: {
      name_tenantId: {
        tenantId: tenant.id,
        name,
      },
    },
  });
  if (reason) {
    if (statusList.every((status) => reason.statuses.includes(status))) {
      return reason;
    }
    const newList = [...new Set([...statusList, ...reason.statuses])];
    console.log(newList);
    return await prisma.reason.update({
      where: {
        id: reason.id,
      },
      data: {
        statuses: {
          set: newList,
        },
      },
    });
  } else {
    return await prisma.reason.create({
      data: {
        tenantId: tenant.id,
        name,
        statuses: statusList,
      },
    });
  }
}

async function backfillTextInformation() {
  const messages = await prisma.message.findMany();
  for (const message of messages) {
    const textInformation = ContentController.TextInformation(message.text);
    await prisma.textInformation.upsert({
      where: { messageId: message.id },
      create: {
        tenantId: message.tenantId,
        messageId: message.id,
        ...textInformation,
      },
      update: {
        ...textInformation,
      },
    });
  }
  const imageOCRs = await prisma.imageOCR.findMany();
  for (const imageOCR of imageOCRs) {
    if (!imageOCR.text || imageOCR.text.length === 0) continue;
    const textInformation = ContentController.TextInformation(imageOCR.text);
    await prisma.textInformation.upsert({
      where: { ocrId: imageOCR.id },
      create: {
        tenantId: imageOCR.tenantId,
        ocrId: imageOCR.id,
        ...textInformation,
      },
      update: {
        ...textInformation,
      },
    });
  }
}

function sample<T>(options: T[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function randomId() {
  return randomUUID();
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
