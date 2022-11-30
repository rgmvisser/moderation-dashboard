import { PrismaClient, SignInMethod, Status } from "@prisma/client";
import { randomUUID } from "crypto";
import randomSentence from "random-sentence";
import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import { ModeratorController } from "~/controllers.ts/moderator.server";

const nameConfig: Config = {
  dictionaries: [names],
};

const prisma = new PrismaClient();

async function seed() {
  // const tenant = await prisma.tenant.findFirstOrThrow();
  // ModeratorController.CreateModerator(tenant, {
  //   name: "Ruud Visser",
  //   email: "visser.rgm@gmail.com",
  //   password: "password",
  //   avatar:
  //     "https://en.gravatar.com/userimage/61402465/c8cdd02ae2207b22c6582d7716e5e8b0.jpeg",
  //   role: "admin",
  // });
  // return;

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

  // Created reasons per status
  await prisma.reason.createMany({
    data: [
      { tenantId: tenant.id, name: "Allowed" },
      { tenantId: tenant.id, name: "Off-topic" },
      { tenantId: tenant.id, name: "Inappropriate" },
      { tenantId: tenant.id, name: "Other" },
    ],
  });
  const reasons = await prisma.reason.findMany();
  for (const reason of reasons) {
    await prisma.statusReasons.create({
      data: {
        status: Status.flagged,
        reason: { connect: { id: reason.id } },
        tenant: { connect: { id: tenant.id } },
      },
    });
    await prisma.statusReasons.create({
      data: {
        status: Status.hidden,
        reason: { connect: { id: reason.id } },
        tenant: { connect: { id: tenant.id } },
      },
    });
  }
  await prisma.statusReasons.create({
    data: {
      status: Status.allowed,
      reason: { create: { tenantId: tenant.id, name: "Inaccurate flag" } },
      tenant: { connect: { id: tenant.id } },
    },
  });
  await prisma.statusReasons.create({
    data: {
      status: Status.allowed,
      reason: { create: { tenantId: tenant.id, name: "Inaccurate hide" } },
      tenant: { connect: { id: tenant.id } },
    },
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

  console.log(`Database has been seeded. 🌱`);
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
