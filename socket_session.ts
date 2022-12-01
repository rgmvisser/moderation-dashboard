import type { Socket } from "socket.io";
import cookieSign from "cookie-signature";
import cookie from "cookie";
import type { User } from "@prisma/client";
import { sessionKey, sessionSecret } from "session";

export function authenticateUser(socket: Socket) {
  // Check auth
  const headerCookie = socket.request.headers.cookie;
  if (!headerCookie) {
    throw new Error("cookie required");
  }
  const cookies = cookie.parse(headerCookie);
  const sessionCookie = cookies[sessionKey];
  const unsigned = cookieSign.unsign(sessionCookie, sessionSecret);
  if (!unsigned) {
    throw new Error("invalid cookie");
  }
  const data = decodeData(unsigned);
  if (!data.user) {
    throw new Error("Unauthorized");
  }
  return data.user as User;
}

function decodeData(value: string): any {
  try {
    return JSON.parse(decodeURIComponent(myEscape(atob(value))));
  } catch (error) {
    return {};
  }
}

function myEscape(value: string): string {
  let str = value.toString();
  let result = "";
  let index = 0;
  let chr, code;
  while (index < str.length) {
    chr = str.charAt(index++);
    if (/[\w*+\-./@]/.exec(chr)) {
      result += chr;
    } else {
      code = chr.charCodeAt(0);
      if (code < 256) {
        result += "%" + hex(code, 2);
      } else {
        result += "%u" + hex(code, 4).toUpperCase();
      }
    }
  }
  return result;
}

function hex(code: number, length: number): string {
  let result = code.toString(16);
  while (result.length < length) result = "0" + result;
  return result;
}
