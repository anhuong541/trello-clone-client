"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "@/constants";

export async function createSession(userId: string) {
  cookies().set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

  // redirect to home route
  redirect(HOME_ROUTE);
}

export async function removeSession() {
  console.log("it trigger !!!!, it clear the cookie");
  cookies().delete(SESSION_COOKIE_NAME);
  redirect(ROOT_ROUTE);
}
