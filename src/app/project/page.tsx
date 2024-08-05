"use client";

import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import CurrentUserFirebase from "@/hooks/user";
import { useEffect } from "react";

export default function ProjectPage() {
  const { user: userId, loading: isLoadingUser } = CurrentUserFirebase();

  useEffect(() => {
    console.log({ user: userId?.uid });
  }, [userId]);

  if (userId) {
    return (
      <main className="h-screen w-screen flex flex-col">
        <Header />
        <div className="grid grid-cols-10 h-full">
          <Sidebar userId={userId?.uid} />
        </div>
      </main>
    );
  }
}
