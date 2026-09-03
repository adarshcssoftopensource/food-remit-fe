import { AUTH_TOKEN_COOKIE } from "@/config/cookie";
import Cookies from "js-cookie";

export interface SetAuthSessionInput {
  accessToken: string;
  expiresInSeconds?: number;
}

export function buildCookieOptions(expiresInDays?: number): Cookies.CookieAttributes {
  return {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresInDays,
  };
}

export function setAuthSession({ accessToken, expiresInSeconds }: SetAuthSessionInput): void {
  if (typeof window === "undefined") return;

  const accessExpiresInDays = expiresInSeconds ? expiresInSeconds / (60 * 60 * 24) : undefined;

  Cookies.set(AUTH_TOKEN_COOKIE, accessToken, buildCookieOptions(accessExpiresInDays));
}

export function clearAuthSession() {
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
}
