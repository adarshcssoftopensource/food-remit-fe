import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/config/routes";
import { AUTH_REFRESH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from "@/config/cookie";

const PUBLIC_PATHS = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.CHANGE_PASSWORD,
  ROUTES.AUTH.FORGOT_PASSWORD,
] as const;

const PRIVATE_PATH_PREFIXES = [ROUTES.ADMIN.DASHBOARD] as const;

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
  const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE)?.value;
  return Boolean(token?.trim() || refreshToken?.trim());
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthToken(request);

  if (pathname === ROUTES.ROOT) {
    if (!authenticated) {
      const response = NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }
    const response = NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

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

  if (isPublicPath(pathname) && authenticated) {
    const response = NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }

  return NextResponse.next();
}
