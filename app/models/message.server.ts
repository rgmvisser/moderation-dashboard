import type { Message, Project, Tenant, Thread, User } from "@prisma/client";
import { Status } from "@prisma/client";
import { getTenantClient } from "~/db.server";
import type { Filter } from "./filter.server";

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

export async function getUserMessages(tenant: Tenant, id: User["id"]) {
  return getTenantClient(tenant).message.findMany({
    where: { userId: id },
    take: 30,
    include: messageInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMessage(
  tenant: Tenant,
  id: Message["id"],
  filter?: Filter
) {
  return getTenantClient(tenant).message.findFirst({
    where: { id: id, ...GetFiltersObjects(filter) },
    include: messageInclude,
  });
}

export async function getUserMessagesStats(tenant: Tenant, id: User["id"]) {
  const grouping = await getTenantClient(tenant).message.groupBy({
    where: {
      userId: id,
    },
    by: ["status"],
    _count: {
      _all: true,
    },
  });
  const total = await getTenantClient(tenant).message.count({
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

export async function getMessages(tenant: Tenant, filter?: Filter) {
  const messages: MessageWithInfo[] = await getTenantClient(
    tenant
  ).message.findMany({
    where: {
      ...GetFiltersObjects(filter),
    },
    take: 30,
    include: messageInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}

function GetFiltersObjects(filter?: Filter) {
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
  return { ...projectFilter, ...threadFilter, ...statusFilter };
}
