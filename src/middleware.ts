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

  const isAuthRoute = pathname === "/signin" || pathname === "/signup" || pathname === "/";
  if (isAuthRoute && session) {
    const destination =
      session === "investor" ? "/investor/overview" : "/issuer/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/investor/:path*", "/issuer/:path*"],
};
