import type { Project, Topic } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export class TopicController extends BaseTenantController {
  async getTopicByExternalId(externalId: string) {
    return await this.db.topic.findUnique({
      where: { externalId },
    });
  }

  async createTopic(name: string, externalId: string, project: Project) {
    return await this.db.topic.create({
      data: {
        name,
        externalId,
        projectId: project.id,
        tenantId: this.tenant.id,
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
