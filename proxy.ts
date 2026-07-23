import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./config/routes";
import { AUTH_REFRESH_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from "./config/cookie";

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthToken(request);

  // Root: unauthenticated -> login; authenticated -> default to investor (role redirect happens client-side from store)
  if (pathname === ROUTES.ROOT) {
    if (!authenticated) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
    }
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
  }

  // Private routes: require token only (role-based redirect is done client-side via AuthProfileSync + role store)
  if (isPrivatePath(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Public auth pages: if already authenticated, redirect to default dashboard
  if (isPublicPath(pathname) && authenticated) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/change-password", "/forgot-password", "/admin/:path*"],
};
