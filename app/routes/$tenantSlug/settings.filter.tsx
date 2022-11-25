import type { ActionFunction } from "@remix-run/node";
import { json } from "remix-supertyped";
import { GetTenant } from "~/middleware/tenant";
import { SetAdminFilters } from "~/models/filter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const tenant = await GetTenant(params);
  const formData = await request.formData();
  const selectedProjects = formData.get("projects")?.toString() ?? "";
  const selectedThreads = formData.get("threads")?.toString() ?? "";
  const selectedStatuses = formData.get("statuses")?.toString() ?? "";
  const filter = await SetAdminFilters(
    tenant,
    selectedProjects,
    selectedThreads,
    selectedStatuses
  );

  return json({ filter });
};
