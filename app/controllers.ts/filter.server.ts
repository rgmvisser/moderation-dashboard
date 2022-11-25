import { Status } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

export type Filter = {
  projects: string[];
  threads: string[];
  statuses: string[];
};

export type FilterInfo = { id: string; name: string }[];

export class FilterController extends BaseTenantController {
  async setmoderatorFilters(
    selectedProjects: string | null,
    selectedThreads: string | null,
    selectedStatuses: string | null
  ) {
    // TODO do this with the actual logged in user
    const moderator = await this.db.moderator.findFirstOrThrow();
    let moderatorFilter = await this.db.moderatorFilters.findUnique({
      where: { moderatorId: moderator.id },
    });
    if (
      selectedProjects != null ||
      selectedThreads != null ||
      selectedStatuses != null
    ) {
      if (moderatorFilter) {
        if (
          moderatorFilter.projects != selectedProjects ||
          moderatorFilter.threads != selectedThreads ||
          moderatorFilter.statuses != selectedStatuses
        ) {
          moderatorFilter = await this.db.moderatorFilters.update({
            where: { id: moderatorFilter.id },
            data: {
              projects: selectedProjects ?? moderatorFilter.projects,
              threads: selectedThreads ?? moderatorFilter.threads,
              statuses: selectedStatuses ?? moderatorFilter.statuses,
            },
          });
        }
      } else {
        moderatorFilter = await this.db.moderatorFilters.create({
          data: {
            tenantId: this.tenant.id,
            moderatorId: moderator.id,
            projects: selectedProjects ?? "",
            threads: selectedThreads ?? "",
            statuses: selectedStatuses ?? "",
          },
        });
      }
    }
  }

  async getModeratorFilter(): Promise<Filter> {
    // TODO do this with the actual logged in user
    const moderator = await this.db.moderator.findFirstOrThrow();
    let moderatorFilter = await this.db.moderatorFilters.findUnique({
      where: { moderatorId: moderator.id },
    });
    if (moderatorFilter) {
      return {
        // make sure that "" => [] instead of [""]
        projects:
          moderatorFilter.projects.length > 0
            ? moderatorFilter.projects.split(",")
            : [],
        threads:
          moderatorFilter.threads.length > 0
            ? moderatorFilter.threads.split(",")
            : [],
        statuses:
          moderatorFilter.statuses.length > 0
            ? moderatorFilter.statuses.split(",")
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
