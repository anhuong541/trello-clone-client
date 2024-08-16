import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "./constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { server } from "./lib/network";
import { removeSession } from "./actions/auth-action";

const protectedRoutes = [HOME_ROUTE];
const routesBanWhenUserSignin = ["/login", "/register", ROOT_ROUTE];

export const checkJwtExpire = async (token: string) => {
  try {
    return await server.get("/user/token-verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // console.log("check jwt expire error: ", error);
    return error;
  }
};

export async function middleware(request: NextRequest) {
  console.log("run middleware! 2");
  // const checkToken = (await checkJwtExpire("tokenSession")) as any;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/project", "/login", "/register", "/project/:path*"],
};
