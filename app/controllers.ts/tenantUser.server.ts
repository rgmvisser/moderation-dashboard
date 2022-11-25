import { getGeneralClient } from "~/db.server";

export async function GetAdmin() {
  return getGeneralClient().admin.findFirstOrThrow({
    include: { tenant: true },
  });
}
