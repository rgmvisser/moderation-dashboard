import { Authenticator } from "remix-auth";
import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { Moderator } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import { ModeratorController } from "./controllers.ts/moderator.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
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

    const user = await ModeratorController.FindModerator(email, password);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // And return the user as the Authenticator expects it
    return user;
  }),
  "email-password"
);
