import { PrismaClient, SignInMethod, Status } from "@prisma/client";
import randomSentence from "random-sentence";
import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";

const nameConfig: Config = {
  dictionaries: [names],
};

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany(); // Messages get cascaded
  await prisma.backlogMessage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.reason.deleteMany();

  await prisma.admin.create({
    data: { name: "Ruud" },
  });

  // Created reasons per status
  await prisma.reason.createMany({
    data: [
      { name: "Allowed" },
      { name: "Off-topic" },
      { name: "Inappropriate" },
      { name: "Other" },
    ],
  });
  const reasons = await prisma.reason.findMany();
  for (const reason of reasons) {
    await prisma.statusReasons.create({
      data: {
        status: Status.flagged,
        reason: { connect: { id: reason.id } },
      },
    });
    await prisma.statusReasons.create({
      data: {
        status: Status.hidden,
        reason: { connect: { id: reason.id } },
      },
    });
  }
  await prisma.statusReasons.create({
    data: {
      status: Status.allowed,
      reason: { create: { name: "Inaccurate flag" } },
    },
  });
  await prisma.statusReasons.create({
    data: {
      status: Status.allowed,
      reason: { create: { name: "Inaccurate hide" } },
    },
  });

  // Create messages
  const numMessages = 10000;
  const numUsers = 100;

  const projects = ["Mysterlyland"];
  const threads = ["Main Stage", "Deephouse", "Food court", "Campground"];

  // 10 times as many flagged/hidden messages
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
        name: project,
      };
    }),
  });
  const projectIds = (
    await prisma.project.findMany({ select: { id: true } })
  ).map((obj) => obj.id);

  await prisma.thread.createMany({
    data: threads.map((thread) => {
      return {
        name: thread,
      };
    }),
  });
  const threadIds = (
    await prisma.thread.findMany({ select: { id: true } })
  ).map((obj) => obj.id);

  await prisma.user.createMany({
    data: Array.from(Array(numUsers).keys()).map((num) => {
      return {
        name: uniqueNamesGenerator(nameConfig),
        location: sample(locations),
        signInMethod: sample(signInMethods),
        status: sample(statuses),
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
  for (let i = 0; i < numMessages; i++) {
    timeMiliseconds += sample(timeMilisecondsOptions);
    randomTimes.push(timeMiliseconds);
  }

  // Create messages
  await prisma.backlogMessage.createMany({
    data: Array.from(Array(numMessages).keys()).map((num) => {
      return {
        message: randomSentence({ min: 1, max: 250 }),
        userId: sample(userIds),
        millisecondsAfterStart: randomTimes[num],
        threadId: sample(threadIds),
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

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
