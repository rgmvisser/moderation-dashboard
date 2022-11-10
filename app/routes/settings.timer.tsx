import type { ActionFunction } from "@remix-run/node";
import { json } from "remix-supertyped";
import { setTimerEnabled, setTimerSpeed } from "~/models/timer.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const speed = parseInt(formData.get("speed")?.toString() ?? "1");
  const enabled = Boolean(formData.get("enabled")?.toString());
  setTimerEnabled(enabled);
  setTimerSpeed(speed);
  return json({ speed, enabled });
};
