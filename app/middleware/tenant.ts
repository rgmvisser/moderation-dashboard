import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { getGeneralClient } from "~/db.server";

export async function GetTenant(params: Params) {
  const tenantSlug = params.tenantSlug;
  const tenant = await getGeneralClient().tenant.findUnique({
    where: { slug: tenantSlug },
  });
  // TODO - Do authentication for the tenant here
  if (!tenant) {
    throw redirect("/");
  }
  return tenant;
}
