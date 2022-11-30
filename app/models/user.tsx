import { SignInMethod } from "@prisma/client";
import { logger } from "~/logger";

export function SignInMethodForString(method: string): SignInMethod {
  switch (method) {
    case "apple.com":
      return SignInMethod.apple;
    case "facebook.com":
      return SignInMethod.facebook;
    case "password":
      return SignInMethod.email;
    case "phone":
      return SignInMethod.phone;
    case "unknown":
      return SignInMethod.unknown;
    case "google.com":
      return SignInMethod.google;
  }
  logger.error("Unknown sign in method: " + method);
  return SignInMethod.unknown;
}
