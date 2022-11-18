import { db } from "~/db.server";

export async function GetAdmin() {
  return await db.admin.findFirst();
}
