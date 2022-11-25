import { Status } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export type Filter = {
  projects: string[];
  threads: string[];
  statuses: string[];
};

export type FilterInfo = { id: string; name: string }[];

export class FilterController extends BaseTenantController {
  async setAdminFilters(
    selectedProjects: string | null,
    selectedThreads: string | null,
    selectedStatuses: string | null
  ) {
    const admin = await this.db.admin.findFirstOrThrow();
    let adminFilter = await this.db.adminFilters.findUnique({
      where: { adminId: admin.id },
    });
    if (
      selectedProjects != null ||
      selectedThreads != null ||
      selectedStatuses != null
    ) {
      if (adminFilter) {
        if (
          adminFilter.projects != selectedProjects ||
          adminFilter.threads != selectedThreads ||
          adminFilter.statuses != selectedStatuses
        ) {
          adminFilter = await this.db.adminFilters.update({
            where: { id: adminFilter.id },
            data: {
              projects: selectedProjects ?? adminFilter.projects,
              threads: selectedThreads ?? adminFilter.threads,
              statuses: selectedStatuses ?? adminFilter.statuses,
            },
          });
        }
      } else {
        adminFilter = await this.db.adminFilters.create({
          data: {
            tenantId: this.tenant.id,
            adminId: admin.id,
            projects: selectedProjects ?? "",
            threads: selectedThreads ?? "",
            statuses: selectedStatuses ?? "",
          },
        });
      }
    }
  }

  async getAdminFilter(): Promise<Filter> {
    const admin = await this.db.admin.findFirstOrThrow();
    let adminFilter = await this.db.adminFilters.findUnique({
      where: { adminId: admin.id },
    });
    if (adminFilter) {
      return {
        // make sure that "" => [] instead of [""]
        projects:
          adminFilter.projects.length > 0
            ? adminFilter.projects.split(",")
            : [],
        threads:
          adminFilter.threads.length > 0 ? adminFilter.threads.split(",") : [],
        statuses:
          adminFilter.statuses.length > 0
            ? adminFilter.statuses.split(",")
            : [],
      };
    }
    return {
      projects: [],
      threads: [],
      statuses: [],
    };
  }

  async getFilterInfo() {
    const projects = await this.db.project.findMany({
      select: { id: true, name: true },
    });
    const threads = await this.db.thread.findMany({
      select: { id: true, name: true },
    });

    const statuses = Object.keys(Status).map((s) => {
      return { id: s, name: s };
    });
    const filterInfo = {
      projects,
      threads,
      statuses,
    };
    return filterInfo;
  }
}
