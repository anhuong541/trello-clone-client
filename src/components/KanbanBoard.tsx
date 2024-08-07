import { useQuery } from "@tanstack/react-query";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { projectStore } from "@/lib/stores";
import { handleViewProjectTasks } from "@/actions/query-actions";

export default function KanbanBoard() {
  const { projectId, userId } = projectStore();
  //   const {userId} = projectStore()

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks({ projectId, userId }),
  });

  const projectTasksList =
    (queryProjectTasksList && queryProjectTasksList.data?.data.data) ?? [];

  console.log({ projectTasksList });

  return (
    <div className="col-span-8 w-full h-full bg-blue-100">
      <div className="w-full h-[73px]" />
      hello world
    </div>
  );
}
