import type { ActionFunction } from "@remix-run/node";
import { json } from "remix-supertyped";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import { FilterController } from "~/controllers.ts/filter.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { moderator, tenant } = await GetModeratorAndTenant(request, params);
  const formData = await request.formData();
  const selectedProjects = formData.get("projects")?.toString() ?? "";
  const selectedTopics = formData.get("topics")?.toString() ?? "";
  const selectedStatuses = formData.get("statuses")?.toString() ?? "";
  const filterController = new FilterController(tenant, moderator);
  const filter = await filterController.setModeratorFilters(
    selectedProjects,
    selectedTopics,
    selectedStatuses
  );

  return json({ filter });
};
