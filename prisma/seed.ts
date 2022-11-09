import { PrismaClient } from "@prisma/client";
import randomSentence from "random-sentence";
import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";

const nameConfig: Config = {
  dictionaries: [names],
};

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany(); // Messages get cascaded

  const numMessages = 10000;
  const numUsers = 1000;

  // Create users
  await prisma.user.createMany({
    data: Array.from(Array(numUsers).keys()).map((num) => {
      return {
        name: uniqueNamesGenerator(nameConfig),
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
  const randomTimes: number[] = [];
  for (let i = 0; i < numMessages; i++) {
    timeMiliseconds += getRandomMillisecondsAfterStart();
    randomTimes.push(timeMiliseconds);
  }

  // Create messages
  await prisma.message.createMany({
    data: Array.from(Array(numMessages).keys()).map((num) => {
      return {
        message: randomSentence({ min: 1, max: 250 }),
        userId: userIds[getRandomInt(userIds.length - 1)],
        millisecondsAfterStart: randomTimes[num],
      };
    }),
  });

  console.log(`Database has been seeded. 🌱`);
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const options = [
  10, 20, 50, 100, 200, 500, 10, 20, 50, 100, 200, 500, 200, 500, 1000, 2000,
  5000,
];
function getRandomMillisecondsAfterStart() {
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
