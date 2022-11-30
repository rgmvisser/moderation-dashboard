import type { Project } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export class ProjectController extends BaseTenantController {
  async getProjectByExternalId(externalId: string) {
    return await this.db.project.findUnique({
      where: { externalId },
    });
  }

  async createProject(name: string, externalId: string) {
    return await this.db.project.create({
      data: {
        name,
        externalId,
        tenantId: this.tenant.id,
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
