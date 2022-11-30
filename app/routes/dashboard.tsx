import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "remix-supertyped";
import { ModeratorController } from "~/controllers/moderator.server";
import { GetAuthenticatedModerator } from "~/middleware/authenticate";

import { QueuePath } from "~/shared/utils.tsx/navigation";

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const moderator = await GetAuthenticatedModerator(request);
  const tenants = await ModeratorController.GetTenantsForModerator(moderator);
  if (tenants.length === 0) {
    throw new Error("No tenants found for moderator");
  }
  return redirect(QueuePath(tenants[0].slug));
}
