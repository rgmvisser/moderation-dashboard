import { redirect } from "remix-supertyped";
import type { AuhtenticationStrategy } from "~/session.server";
import { authenticator } from "~/session.server";
import { DashboardPath, LoginPath } from "~/shared/utils.tsx/navigation";

export async function IsAuthenticated(request: Request) {
  const moderator = await authenticator.isAuthenticated(request);
  return moderator != null;
}

export async function GetAuthenticatedModerator(request: Request) {
  const moderator = await authenticator.isAuthenticated(request);
  if (!moderator) {
    throw redirect(LoginPath());
  }
  return moderator;
}

export async function AuthenticateModerator(
  strategy: AuhtenticationStrategy,
  request: Request
) {
  return authenticator.authenticate(strategy, request, {
    throwOnError: true,
    successRedirect: DashboardPath(),
  });
}

export async function Logout(request: Request) {
  return authenticator.logout(request, {
    redirectTo: LoginPath(),
  });
}
