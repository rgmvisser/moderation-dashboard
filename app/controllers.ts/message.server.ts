import type { Message, Project, Thread, User } from "@prisma/client";
import { Status } from "@prisma/client";
import { MessageWithInfo } from "~/models/message";
import { BaseTenantController } from "./baseController.server";
import type { Filter } from "./filter.server";

export class MessageController extends BaseTenantController {
  messageInclude = {
    user: true,
    project: true,
    thread: true,
  };

  async getUserMessages(id: User["id"]) {
    return this.db.message.findMany({
      where: { userId: id },
      take: 30,
      include: this.messageInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMessage(id: Message["id"], filter?: Filter) {
    return this.db.message.findFirst({
      where: { id: id, ...this.getFiltersObjects(filter) },
      include: this.messageInclude,
    });
  }

  async getUserMessagesStats(id: User["id"]) {
    const grouping = await this.db.message.groupBy({
      where: {
        userId: id,
      },
      by: ["status"],
      _count: {
        _all: true,
      },
    });
    const total = await this.db.message.count({
      where: {
        userId: id,
      },
    });

    const counts: Record<Status | "total", number> = {
      allowed:
        grouping.find((group) => group.status === Status.allowed)?._count
          ._all ?? 0,
      flagged:
        grouping.find((group) => group.status === Status.flagged)?._count
          ._all ?? 0,
      hidden:
        grouping.find((group) => group.status === Status.hidden)?._count._all ??
        0,
      total: total,
    };
    return counts;
  }

  async getMessages(filter?: Filter) {
    const messages: MessageWithInfo[] = await this.db.message.findMany({
      where: {
        ...this.getFiltersObjects(filter),
      },
      take: 30,
      include: this.messageInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
    return messages;
  }

  private getFiltersObjects(filter?: Filter) {
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
}
