import type { LoaderArgs } from "@remix-run/server-runtime";
import { Logout } from "~/middleware/authenticate";

export async function loader({ request }: LoaderArgs) {
  return await Logout(request);
}
