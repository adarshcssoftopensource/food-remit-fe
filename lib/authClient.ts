import Cookies from "js-cookie";
import { AUTH_REFRESH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from "@/config/cookie";

export interface SetAuthSessionInput {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds?: number;
}

const DEFAULT_REFRESH_MAX_AGE_DAYS = 1;

function buildCookieOptions(expiresInDays?: number): Cookies.CookieAttributes {
  return {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresInDays,
  };
}

export function setAuthSession({
  accessToken,
  refreshToken,
  expiresInSeconds,
}: SetAuthSessionInput): void {
  if (typeof window === "undefined") return;

  const accessExpiresInDays = expiresInSeconds ? expiresInSeconds / (60 * 60 * 24) : undefined;

  Cookies.set(AUTH_TOKEN_COOKIE, accessToken, buildCookieOptions(accessExpiresInDays));
  Cookies.set(
    AUTH_REFRESH_TOKEN_COOKIE,
    refreshToken,
    buildCookieOptions(DEFAULT_REFRESH_MAX_AGE_DAYS),
  );
}

export function clearAuthSession() {
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(AUTH_REFRESH_TOKEN_COOKIE, { path: "/" });
}
