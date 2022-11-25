import type { ActionFunction } from "@remix-run/node";
import { json } from "remix-supertyped";
import { GetTenant } from "~/middleware/tenant";
import { FilterController } from "~/controllers.ts/filter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const tenant = await GetTenant(params);
  const formData = await request.formData();
  const selectedProjects = formData.get("projects")?.toString() ?? "";
  const selectedThreads = formData.get("threads")?.toString() ?? "";
  const selectedStatuses = formData.get("statuses")?.toString() ?? "";
  const filterController = new FilterController(tenant);
  const filter = await filterController.setmoderatorFilters(
    selectedProjects,
    selectedThreads,
    selectedStatuses
  );

  return json({ filter });
};
