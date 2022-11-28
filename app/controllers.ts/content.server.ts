import type { Content, Project, Topic, User } from "@prisma/client";
import { Status } from "@prisma/client";
import { ContentWithInfo } from "~/models/content";
import { BaseTenantController } from "./baseController.server";
import type { Filter } from "./filter.server";

export class ContentController extends BaseTenantController {
  contentInclude = {
    user: true,
    project: true,
    topic: true,
  };

  async getUserContents(id: User["id"]) {
    return this.db.content.findMany({
      where: { userId: id },
      take: 30,
      include: this.contentInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getContent(id: Content["id"], filter?: Filter) {
    return this.db.content.findFirst({
      where: { id: id, ...this.getFiltersObjects(filter) },
      include: this.contentInclude,
    });
  }

  async getUserContentsStats(id: User["id"]) {
    const grouping = await this.db.content.groupBy({
      where: {
        userId: id,
      },
      by: ["status"],
      _count: {
        _all: true,
      },
    });
    const total = await this.db.content.count({
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

  async getContents(filter?: Filter) {
    const contents: ContentWithInfo[] = await this.db.content.findMany({
      where: {
        ...this.getFiltersObjects(filter),
      },
      take: 30,
      include: this.contentInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
    return contents;
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
    const topicFilter =
      (filter?.topics.length ?? 0) > 0
        ? {
            topicId: {
              in: filter?.topics,
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
    return { ...projectFilter, ...topicFilter, ...statusFilter };
  }
}
