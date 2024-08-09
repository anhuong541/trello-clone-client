"use client";

import KanbanBoard from "@/components/KanbanBoard";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { projectId, userId } = useParams<{
    projectId: string;
    userId: string;
  }>();

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-10 h-full">
        <Sidebar userId={userId} />
        <KanbanBoard projectId={projectId} userId={userId} />
      </div>
    </main>
  );
}
