import type {
  Content,
  Image,
  Message,
  Project,
  Topic,
  User,
} from "@prisma/client";
import { Status } from "@prisma/client";
import type { ContentWithInfo } from "~/models/content";
import { BaseTenantController } from "./baseController.server";
import type { Filter } from "./filter.server";

export class ContentController extends BaseTenantController {
  contentInclude = {
    user: true,
    project: true,
    topic: true,
    image: true,
    message: true,
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

  async getContentByExternalId(externalId: Content["externalId"]) {
    return this.db.content.findUnique({
      where: { externalId },
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

  async upsertContent(
    user: User,
    project: Project,
    topic: Topic,
    {
      externalId,
      createdAt,
      message_text,
      image_url,
      status,
    }: {
      externalId: string;
      createdAt: Date;
      status?: Status;
      message_text?: string;
      image_url?: string;
    }
  ): Promise<Content> {
    // Note: upsert is only done natively if it satisfies these conditions:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
    const content = await this.db.content.upsert({
      where: { externalId },
      create: {
        tenantId: this.tenant.id,
        externalId,
        createdAt,
        status: status ?? Status.allowed,
        millisecondsAfterStart: 0,
        userId: user.id,
        projectId: project.id,
        topicId: topic.id,
      },
      update: {
        // Make sure we set these too, because the upsert does not work if there are no updates
        userId: user.id,
        projectId: project.id,
        topicId: topic.id,
        status: status,
      },
    });
    if (message_text) {
      await this.db.message.upsert({
        where: { contentId: content.id },
        create: {
          tenantId: this.tenant.id,
          contentId: content.id,
          text: message_text,
        },
        update: {
          text: message_text,
        },
      });
    }
    if (image_url) {
      await this.db.image.upsert({
        where: { contentId: content.id },
        create: {
          tenantId: this.tenant.id,
          contentId: content.id,
          url: image_url,
        },
        update: {
          url: image_url,
        },
      });
    }
    return content;
  }

  async updateContent(
    content: ContentWithInfo,
    {
      text,
      image_url,
    }: {
      text?: string;
      image_url?: string;
    }
  ): Promise<ContentWithInfo> {
    if (!text && !image_url) {
      return content;
    }
    if (image_url && image_url === content.image?.url) {
      return content;
    }
    if (text && text === content.message?.text) {
      return content;
    }
    return await this.db.content.update({
      where: { id: content.id },
      data: {
        message: text
          ? {
              update: {
                text,
              },
            }
          : undefined,
        image: image_url
          ? {
              update: {
                url: image_url,
              },
            }
          : undefined,
      },
      include: this.contentInclude,
    });
  }
}
