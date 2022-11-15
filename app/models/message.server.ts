import { Message, Project, Status, Thread, User } from "@prisma/client";
import { db } from "~/db.server";
import { Filter } from "./filter.server";

export type MessageWithInfo = Message & {
  user: User;
  project: Project;
  thread: Thread;
};

const messageInclude = {
  user: true,
  project: true,
  thread: true,
};

export async function getUserMessages(id: User["id"]) {
  return db.message.findMany({
    where: { userId: id },
    take: 30,
    include: messageInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMessage(id: Message["id"]) {
  return db.message.findUnique({
    where: { id: id },
    include: messageInclude,
  });
}

export async function getUserMessagesStats(id: User["id"]) {
  const grouping = await db.message.groupBy({
    where: {
      userId: id,
    },
    by: ["status"],
    _count: {
      _all: true,
    },
  });
  const total = await db.message.count({
    where: {
      userId: id,
    },
  });

  const counts: Record<Status | "total", number> = {
    allowed:
      grouping.find((group) => group.status === Status.allowed)?._count._all ??
      0,
    flagged:
      grouping.find((group) => group.status === Status.flagged)?._count._all ??
      0,
    hidden:
      grouping.find((group) => group.status === Status.hidden)?._count._all ??
      0,
    total: total,
  };
  return counts;
}

export async function getMessages(filter?: Filter) {
  const projectFilter =
    (filter?.projects.length ?? 0) > 0
      ? {
          projectId: {
            in: filter?.projects,
          },
        }
      : {};
  const threadFilter =
    (filter?.threads.length ?? 0) > 0
      ? {
          threadId: {
            in: filter?.threads,
          },
        }
      : {};
  const statusFilter =
    (filter?.statuses?.length ?? 0) > 0
      ? {
          status: {
            in: filter?.statuses as Status[],
          },
        }
      : {};
  const messages: MessageWithInfo[] = await db.message.findMany({
    where: {
      ...projectFilter,
      ...threadFilter,
      ...statusFilter,
    },
    take: 30,
    include: messageInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}
