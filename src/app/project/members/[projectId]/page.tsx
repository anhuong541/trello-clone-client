import { Sidebar } from "@/components/layouts/Sidebar";
import Members from "@/components/pages/members/members";

export default async function MembersPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="lg:grid lg:grid-cols-10 flex h-full">
      <Sidebar projectId={params.projectId} />
      <Members projectId={params.projectId} />
    </div>
  );
}
