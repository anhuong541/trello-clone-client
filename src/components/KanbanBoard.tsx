import { MdAdd, MdClear, MdOutlineSubject } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  handleViewProjectTasks,
  onCreateNewTask,
} from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { kanbanTableStore, projectStore } from "@/lib/stores";

import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { KanbanBoardType, TaskItem, TaskStatusType } from "@/types";
import { DndContext } from "@dnd-kit/core";
import { Draggable, Droppable } from "./DragFeat";

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
  const { kanbanBoardData, updateKanbanBoardData } = kanbanTableStore();

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks({ projectId, userId }),
  });

  useMemo(() => {
    if (queryProjectTasksList) {
      const projectTasksList = queryProjectTasksList.data?.data?.data ?? [];
      let mapKanbanOpen: TaskItem[] = [];
      let mapKanbanInprogress: TaskItem[] = [];
      let mapKanbanResolved: TaskItem[] = [];
      let mapKanbanClosed: TaskItem[] = [];

      console.log({ projectTasksList });

      const filterProject = projectTasksList.forEach((item: TaskItem) => {
        switch (item.taskStatus) {
          case "Open":
            mapKanbanOpen = [...mapKanbanOpen, item];
            break;
          case "In-progress":
            mapKanbanInprogress = [...mapKanbanInprogress, item];
            break;
          case "Resolved":
            mapKanbanResolved = [...mapKanbanResolved, item];
            break;
          case "Closed":
            mapKanbanClosed = [...mapKanbanClosed, item];
            break;
        }
      });

      const kanbanBoardList: KanbanBoardType[] = [
        {
          label: "Open",
          table: mapKanbanOpen,
        },
        {
          label: "In-progress",
          table: mapKanbanInprogress,
        },
        {
          label: "Resolved",
          table: mapKanbanResolved,
        },
        {
          label: "Closed",
          table: mapKanbanClosed,
        },
      ];

      updateKanbanBoardData(kanbanBoardList);
    }
  }, [projectId, queryProjectTasksList]);

  if (projectId !== "") {
    return (
      <div className="col-span-8 w-full h-full bg-blue-100">
        <div className="w-full h-[49px]" />
        <DndContext
          onDragStart={(e) => {
            console.log({ e: e.active.id });
          }}
          onDragEnd={(e) => {
            console.log({ e: e });
          }}
        >
          <ul className="grid grid-cols-4 gap-2 px-2 relative">
            {kanbanBoardData.map((table) => {
              return (
                <li className="flex flex-col h-full" key={table.label}>
                  <div className="flex-col px-2 py-2 bg-blue-200 rounded-lg">
                    <h4 className="p-2 font-bold">{table.label}</h4>
                    <div
                      // id={table.label}
                      className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-235px)]"
                    >
                      {(table.table ?? []).map((item: TaskItem) => {
                        return (
                          <Droppable key={item.taskId} id={table.label}>
                            <Draggable
                              id={item.taskId}
                              className="space-y-2 p-2 bg-gray-100 rounded-md cursor-pointer"
                            >
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
                              <div
                                className="flex items-center gap-2"
                                id="icon-state"
                              >
                                <MdOutlineSubject />
                                <div className="text-xs">{item.priority}</div>
                                <div className="text-xs">{item.storyPoint}</div>
                              </div>
                            </Draggable>
                          </Droppable>
                        );
                      })}
                    </div>
                    <AddTask
                      projectId={projectId}
                      userId={userId}
                      taskStatus={table.label}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </DndContext>
      </div>
    );
  }
}
