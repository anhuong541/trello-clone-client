import { MdAdd, MdClear, MdOutlineSubject } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  handleViewProjectTasks,
  onCreateNewTask,
} from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { projectStore } from "@/lib/stores";

import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { TaskStatusType } from "@/types";

interface TaskType {
  taskTitle: string;
}

function AddTask({
  projectId,
  userId,
  taskStatus,
}: {
  projectId: string;
  userId: string;
  taskStatus: TaskStatusType;
}) {
  const queryClient = useQueryClient();
  const [openAddTask, setOpenAddTask] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<TaskType>();

  const addTaskAction = useMutation({
    mutationKey: [reactQueryKeys.addTask],
    mutationFn: onCreateNewTask,
  });

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    await addTaskAction.mutateAsync({
      userId,
      projectId,
      title: data.taskTitle,
      priority: "Low", // auto Low edit next time
      description: "",
      dueDate: Date.now(),
      startDate: Date.now(),
      taskStatus, // need to change after create by status take from props
      storyPoint: 1,
    });

    queryClient.refetchQueries({
      queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    });
    setOpenAddTask(false);
    reset();
  };

  if (openAddTask) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-3"
      >
        <Input {...register("taskTitle")} placeholder="Task name" />
        <div className="flex items-center gap-2">
          <Button type="submit" className="py-1 px-2 w-[100px]">
            Add Task
          </Button>
          <Button
            size="icon"
            className="bg-blue-200 text-black hover:bg-gray-200"
            onClick={() => setOpenAddTask(false)}
          >
            <MdClear className="w-6 h-6" />
          </Button>
        </div>
      </form>
    );
  } else {
    return (
      <button
        className="py-1 px-2 mt-3 w-full flex items-center gap-1 text-sm hover:bg-gray-200 hover:text-gray-600 rounded-md font-bold"
        onClick={() => setOpenAddTask(true)}
      >
        <MdAdd className="h-6 w-6 font-medium" /> Add Task
      </button>
    );
  }
}

export default function KanbanBoard() {
  const { projectId, userId } = projectStore();
  const mapKanbanTable = new Map();

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks({ projectId, userId }),
  });

  const projectTasksList =
    (queryProjectTasksList && queryProjectTasksList.data?.data.data) ?? [];

  const filterProject = projectTasksList.forEach((item: any) => {
    const latestValue = mapKanbanTable.get(item.taskStatus) ?? [];
    mapKanbanTable.set(item.taskStatus, [...latestValue, item]);
  });

  const kanbanBoardList: {
    label: TaskStatusType;
    table: any;
  }[] = [
    {
      label: "Open",
      table: mapKanbanTable.get("Open"),
    },
    {
      label: "In-progress",
      table: mapKanbanTable.get("In-progress"),
    },
    {
      label: "Resolved",
      table: mapKanbanTable.get("Resolved"),
    },
    {
      label: "Closed",
      table: mapKanbanTable.get("Closed"),
    },
  ];

  if (projectId !== "") {
    return (
      <div className="col-span-8 w-full h-full bg-blue-100">
        <div className="w-full h-[49px]" />
        <ul className="grid grid-cols-4 gap-2 px-2">
          {kanbanBoardList.map((item, index: number) => {
            return (
              <li className="flex flex-col h-full" key={index}>
                <div className="flex-col px-2 py-2 bg-blue-200 rounded-lg">
                  <h4 className="p-2 font-bold">{item.label}</h4>
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-235px)]">
                    {(item.table ?? []).map((item: any, index: number) => {
                      return (
                        <div
                          className="space-y-2 p-2 bg-gray-100 rounded-md cursor-pointer"
                          key={index}
                        >
                          <p className="text-sm font-medium">{item.title}</p>
                          <div
                            className="flex items-center gap-2"
                            id="icon-state"
                          >
                            <MdOutlineSubject />
                            <div className="text-xs">{item.priority}</div>
                            <div className="text-xs">{item.storyPoint}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <AddTask
                    projectId={projectId}
                    userId={userId}
                    taskStatus={item.label}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
