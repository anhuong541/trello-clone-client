import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "./constants";

const protectedRoutes = [HOME_ROUTE];
const routesBanWhenUserSignin = ["/login", "/register", ROOT_ROUTE];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  // Redirect to login if session is not set
  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (session && routesBanWhenUserSignin.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(HOME_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/project", "/login", "/register"],
};
