"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_TOKEN, HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/constants";
import { isProduction } from "@/lib/network";

export async function createSession(authToken: string) {
  await cookies().set(SESSION_COOKIE_NAME, authToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  if (isProduction) {
    await cookies().set(AUTH_TOKEN, authToken, {
      maxAge: 60 * 60 * 24, // One day
      path: "/",
    });
  }
  // redirect to home route
  await redirect(HOME_ROUTE);
}

export async function removeSession() {
  await cookies().delete(SESSION_COOKIE_NAME);
  await cookies().delete(AUTH_TOKEN);
  await redirect(ROOT_ROUTE);
}
