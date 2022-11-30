import { redirect } from "remix-supertyped";
import { APIKeyController } from "~/controllers/apikey.server";
import { getGeneralClient } from "~/db.server";
import type { AuhtenticationStrategy } from "~/session.server";
import { authenticator } from "~/session.server";
import { DashboardPath, LoginPath } from "~/shared/utils.tsx/navigation";

export async function IsAuthenticated(request: Request) {
  const moderator = await authenticator.isAuthenticated(request);
  return moderator != null;
}

export async function GetAuthenticatedModerator(request: Request) {
  const moderator = await GetOptionalAuthenticatedModerator(request);
  if (!moderator) {
    throw redirect(LoginPath());
  }
  return moderator;
}

export async function GetOptionalAuthenticatedModerator(request: Request) {
  return await authenticator.isAuthenticated(request);
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

export async function GetAuthenticatedAPIKey(request: Request) {
  // Get bearer token from request
  const token = GetAuthenticationHeader(request)?.replace("Bearer ", "");
  if (!token) {
    throw new Error(
      "No API key provided, please provide a 'Authorization' header 'Bearer' token"
    );
  }
  const hashedAPIkey = await APIKeyController.HashKey(token);
  const apiKey = await getGeneralClient().apiKey.findUnique({
    where: {
      hashedKey: hashedAPIkey,
    },
    include: {
      tenant: true,
    },
  });
  if (!apiKey) {
    throw new Error(
      "Invalid API key provided, please provide a valid 'Authorization' header"
    );
  }
  return apiKey;
}

function GetAuthenticationHeader(request: Request) {
  return (
    request.headers.get("Authorization") ??
    request.headers.get("authorization") ??
    request.headers.get("X-API-Key") ??
    request.headers.get("X-Api-Key")
  );
}
