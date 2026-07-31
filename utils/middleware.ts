import { AUTH_TOKEN_COOKIE } from "@/config/cookie";
import { ROUTES } from "@/config/routes";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.CHANGE_PASSWORD,
  ROUTES.AUTH.FORGOT_PASSWORD,
] as const;

const PRIVATE_PATH_PREFIXES = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN] as const;

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function hasAuthToken(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  return Boolean(token?.trim());
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthToken(request);

  if (isPrivatePath(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }
    return NextResponse.next();
  }

  // Auth screens are guests-only. `/` stays public as the vendor landing page.
  if (isPublicPath(pathname) && authenticated) {
    const response = NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

  return NextResponse.next();
}
