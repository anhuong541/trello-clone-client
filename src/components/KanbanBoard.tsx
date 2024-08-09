import { MdAdd, MdClear, MdOutlineSubject } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  handleViewProjectTasks,
  onChangeTaskState,
  onCreateNewTask,
} from "@/actions/query-actions";
import { KanbanBoardType, TaskItem, TaskStatusType } from "@/types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { TaskInput } from "@/types/query-types";
import { generateNewUid } from "@/lib/utils";

import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { Draggable, Droppable } from "./DragFeat";

interface TaskType {
  taskTitle: string;
}

function addTaskToStatusGroup(
  data: KanbanBoardType[],
  newTask: TaskInput
): KanbanBoardType[] {
  const group = data.find((group) => group.label === newTask.taskStatus);

  if (group) {
    group.table.push(newTask);
  } else {
    data.push({
      label: newTask.taskStatus,
      table: [newTask],
    });
  }
  return data;
}

function AddTask({
  projectId,
  userId,
  taskStatus,
  onAddTableData,
  kanbanData,
}: {
  projectId: string;
  userId: string;
  taskStatus: TaskStatusType;
  onAddTableData: any;
  kanbanData: KanbanBoardType[];
}) {
  const [openAddTask, setOpenAddTask] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<TaskType>();

  const addTaskAction = useMutation({
    mutationKey: [reactQueryKeys.addTask],
    mutationFn: onCreateNewTask,
  });

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    if (data.taskTitle !== "") {
      const newTaskId = generateNewUid();
      const dataAddTask: TaskInput = {
        taskId: newTaskId,
        userId,
        projectId,
        title: data.taskTitle,
        priority: "Low", // auto Low edit next time
        description: "",
        dueDate: Date.now(),
        startDate: Date.now(),
        taskStatus, // need to change after create by status take from props
        storyPoint: 1,
      };

      const dataLater = addTaskToStatusGroup(kanbanData, dataAddTask);
      await addTaskAction.mutateAsync(dataAddTask);

      onAddTableData([...dataLater]);

      console.log("data before: ", kanbanData);
      console.log("data later: ", dataLater);

      setOpenAddTask(false);
      reset();
    }
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

export default function KanbanBoard({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const [kanbanData, setKanbanData] = useState<KanbanBoardType[] | null>(null);
  const [currentProjectTaskList, setCurrentProjectTaskList] = useState<
    TaskItem[] | null
  >(null);

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks({ projectId, userId }),
    enabled: true,
  });

  const updateTaskAction = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const handleDragEnd = async (e: DragEndEvent) => {
    if (e.over?.id !== e.active.data.current?.taskStatus) {
      const dataInput: any = {
        ...e.active.data.current,
        taskStatus: e.over?.id,
      };
      const createKanbanMap = new Map();
      const projectTasksList = currentProjectTaskList
        ? currentProjectTaskList
        : queryProjectTasksList.data?.data?.data ?? [];

      const newValue: TaskItem[] = projectTasksList.map((item: TaskItem) => {
        if (item.taskId !== e.active.data.current?.taskId) {
          const value = createKanbanMap.get(item.taskStatus) ?? [];
          createKanbanMap.set(item.taskStatus, [...value, item]);
          return item;
        } else {
          const value = createKanbanMap.get(e.over?.id) ?? [];
          createKanbanMap.set(e.over?.id, [...value, dataInput]);
          return dataInput;
        }
      });

      setCurrentProjectTaskList([...newValue]);

      setKanbanData([
        {
          label: "Open",
          table: createKanbanMap.get("Open"),
        },
        {
          label: "In-progress",
          table: createKanbanMap.get("In-progress"),
        },
        {
          label: "Resolved",
          table: createKanbanMap.get("Resolved"),
        },
        {
          label: "Closed",
          table: createKanbanMap.get("Closed"),
        },
      ]);

      // await updateTaskAction.mutateAsync(dataInput);
    }
  };

  useEffect(() => {
    if (!kanbanData) {
      const createKanbanMap = new Map();
      const projectTasksList = queryProjectTasksList.data?.data?.data ?? [];
      const filterProject = projectTasksList.forEach((item: TaskItem) => {
        const value = createKanbanMap.get(item.taskStatus) ?? [];
        createKanbanMap.set(item.taskStatus, [...value, item]);
      });

      if (createKanbanMap.get("Open")) {
        setKanbanData([
          {
            label: "Open",
            table: createKanbanMap.get("Open"),
          },
          {
            label: "In-progress",
            table: createKanbanMap.get("In-progress"),
          },
          {
            label: "Resolved",
            table: createKanbanMap.get("Resolved"),
          },
          {
            label: "Closed",
            table: createKanbanMap.get("Closed"),
          },
        ]);
      }
    }
  }, [kanbanData, queryProjectTasksList]);

  console.log(kanbanData, "kanbanData");

  if (projectId !== "") {
    return (
      <div className="col-span-8 w-full h-full bg-blue-100">
        <div className="w-full h-[49px]" />
        <DndContext onDragEnd={handleDragEnd}>
          <ul className="grid grid-cols-4 gap-2 px-2 relative h-[calc(100%-49px)]">
            {(kanbanData ?? []).map((table) => {
              return (
                <Droppable
                  className="flex flex-col h-full"
                  key={table.label}
                  id={table.label}
                >
                  <div className="flex-col px-2 py-2 bg-blue-200 rounded-lg">
                    <h4 className="p-2 font-bold">{table.label}</h4>
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-235px)]">
                      {(table.table ?? []).map((item: TaskItem) => {
                        return (
                          <Draggable
                            key={item.taskId}
                            id={item.taskId}
                            className="space-y-2 p-2 bg-gray-100 rounded-md cursor-pointer"
                            dataItem={item}
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
                          </Draggable>
                        );
                      })}
                    </div>
                    <AddTask
                      projectId={projectId}
                      userId={userId}
                      taskStatus={table.label}
                      onAddTableData={setKanbanData}
                      kanbanData={kanbanData ?? []}
                    />
                  </div>
                </Droppable>
              );
            })}
          </ul>
        </DndContext>
      </div>
    );
  }
}
