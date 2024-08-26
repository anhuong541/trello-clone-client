import { Sidebar } from "@/components/layouts/Sidebar";
import KanbanBoard from "@/components/pages/project/kanbanTable/KanbanBoard";
import SelectProjectMobileView from "@/components/pages/project/SelectProjectMobileView";

export default function Project({ projectId }: { projectId: string }) {
  if (projectId === "") {
    return (
      <>
        <div className="lg:grid lg:grid-cols-10 hidden h-full">
          <Sidebar projectId="" />
          <div className="col-span-8 bg-blue-100" />
        </div>

        <SelectProjectMobileView />
      </>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-10 flex h-full">
      <Sidebar projectId={projectId} />
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
