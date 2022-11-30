import type { Project, Topic } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export class TopicController extends BaseTenantController {
  async getTopicByExternalId(externalId: string) {
    return await this.db.topic.findUnique({
      where: { externalId },
    });
  }

  async upsertTopic(name: string, externalId: string, project: Project) {
    // Note: upsert is only done natively if it satisfies these conditions:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
    return await this.db.topic.upsert({
      where: {
        externalId,
      },
      create: {
        name,
        externalId,
        projectId: project.id,
        tenantId: this.tenant.id,
      },
      update: {
        name,
      },
    });
  }

  async updateTopic(topic: Topic, name: string) {
    return await this.db.topic.update({
      where: { id: topic.id },
      data: { name },
    });
  }
}
