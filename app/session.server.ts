import { Authenticator } from "remix-auth";
import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import { FormStrategy } from "remix-auth-form";
import { ModeratorController } from "./controllers/moderator.server";
import { sessionKey, sessionSecret } from "session";
import type { Moderator } from "@prisma/client";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: sessionKey,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export let authenticator = new Authenticator<Moderator>(sessionStorage);

export type AuhtenticationStrategy = "email-password";

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    const email = form.get("email");
    const password = form.get("password");

    // You can validate the inputs however you want
    invariant(typeof email === "string", "username must be a string");
    invariant(email.length > 0, "username must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    const moderator = await ModeratorController.FindModerator(email, password);
    if (!moderator) {
      throw new Error("Invalid email or password");
    }

    // And return the user as the Authenticator expects it
    return moderator;
  }),
  "email-password"
);
