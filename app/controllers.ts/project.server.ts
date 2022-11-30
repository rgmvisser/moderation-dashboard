import type { Project } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export class ProjectController extends BaseTenantController {
  async getProjectByExternalId(externalId: string) {
    return await this.db.project.findUnique({
      where: { externalId },
    });
  }

  async upsertProject(name: string, externalId: string) {
    // Note: upsert is only done natively if it satisfies these conditions:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
    return await this.db.project.upsert({
      where: { externalId },
      create: {
        name,
        externalId,
        tenantId: this.tenant.id,
      },
      update: {
        name,
      },
    });
  }

  async updateProject(project: Project, name: string) {
    return await this.db.project.update({
      where: { id: project.id },
      data: { name },
    });
  }
}
