import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "maxtronize_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  const isPortalRoute =
    pathname.startsWith("/investor") || pathname.startsWith("/issuer");

  if (isPortalRoute && !session) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/setup-profile" && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const isAuthRoute =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/";
  if (isAuthRoute && session) {
    const destination =
      session === "investor" ? "/investor/overview" : "/issuer/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/setup-profile",
    "/investor/:path*",
    "/issuer/:path*",
  ],
};
