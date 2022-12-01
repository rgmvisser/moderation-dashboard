import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
export const sessionSecret = process.env.SESSION_SECRET;
export const sessionKey = "__session";
