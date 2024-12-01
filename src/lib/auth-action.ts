"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_TOKEN, HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/constants";
import { isProduction } from "@/lib/network";

export async function createSession(authToken: string) {
  cookies().set(SESSION_COOKIE_NAME, authToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  if (isProduction) {
    cookies().set(AUTH_TOKEN, authToken, {
      maxAge: 60 * 60 * 24, // One day
      path: "/",
    });
  }
  // redirect to home route
  redirect(HOME_ROUTE);
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(AUTH_TOKEN);
  redirect(ROOT_ROUTE);
}

export async function redirectAction(route: string) {
  redirect(route);
}
