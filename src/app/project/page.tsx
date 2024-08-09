"use client";

import KanbanBoard from "@/components/KanbanBoard";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { userIdStore } from "@/lib/stores";

export default function ProjectPage() {
  const { userId, updateUID } = userIdStore();

  if (userId) {
    return (
      <main className="h-screen w-screen flex flex-col">
        <Header />
        <div className="grid grid-cols-10 h-full">
          <Sidebar userId={userId} projectId="" />
          {/* <KanbanBoard /> */}
        </div>
      </main>
    );
  }
}
