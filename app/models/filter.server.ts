import { Status, Tenant } from "@prisma/client";
import { getTenantClient } from "~/db.server";

export type Filter = {
  projects: string[];
  threads: string[];
  statuses: string[];
};

export type FilterInfo = { id: string; name: string }[];

export async function SetAdminFilters(
  tenant: Tenant,
  selectedProjects: string | null,
  selectedThreads: string | null,
  selectedStatuses: string | null
) {
  const admin = await getTenantClient(tenant).admin.findFirstOrThrow();
  let adminFilter = await getTenantClient(tenant).adminFilters.findUnique({
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
        adminFilter = await getTenantClient(tenant).adminFilters.update({
          where: { id: adminFilter.id },
          data: {
            projects: selectedProjects ?? adminFilter.projects,
            threads: selectedThreads ?? adminFilter.threads,
            statuses: selectedStatuses ?? adminFilter.statuses,
          },
        });
      }
    } else {
      adminFilter = await getTenantClient(tenant).adminFilters.create({
        data: {
          tenantId: tenant.id,
          adminId: admin.id,
          projects: selectedProjects ?? "",
          threads: selectedThreads ?? "",
          statuses: selectedStatuses ?? "",
        },
      });
    }
  }
}

export async function GetAdminFilter(tenant: Tenant): Promise<Filter> {
  const admin = await getTenantClient(tenant).admin.findFirstOrThrow();
  let adminFilter = await getTenantClient(tenant).adminFilters.findUnique({
    where: { adminId: admin.id },
  });
  if (adminFilter) {
    return {
      // make sure that "" => [] instead of [""]
      projects:
        adminFilter.projects.length > 0 ? adminFilter.projects.split(",") : [],
      threads:
        adminFilter.threads.length > 0 ? adminFilter.threads.split(",") : [],
      statuses:
        adminFilter.statuses.length > 0 ? adminFilter.statuses.split(",") : [],
    };
  }
  return {
    projects: [],
    threads: [],
    statuses: [],
  };
}

export async function GetFilterInfo(tenant: Tenant) {
  const projects = await getTenantClient(tenant).project.findMany({
    select: { id: true, name: true },
  });
  const threads = await getTenantClient(tenant).thread.findMany({
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
