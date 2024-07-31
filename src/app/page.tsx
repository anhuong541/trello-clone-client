"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex gap-4 p-4">
      <Link
        href="/login"
        className="px-4 p-2 bg-green-600 text-white rounded-md font-medium"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 p-2 bg-green-600 text-white rounded-md font-medium"
      >
        Register
      </Link>
    </main>
  );
}
