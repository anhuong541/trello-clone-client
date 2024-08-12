"use client";

import {
  MdAdd,
  MdClear,
  MdDeleteOutline,
  MdOutlineSubject,
} from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  handleViewProjectTasks,
  onChangeTaskState,
  onCreateNewTask,
} from "@/actions/query-actions";
import { KanbanBoardType, TaskItem, TaskStatusType } from "@/types";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { TaskInput } from "@/types/query-types";
import { generateNewUid } from "@/lib/utils";

import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { Draggable, Droppable } from "./DragFeat";

interface TaskType {
  taskTitle: string;
}

const initialKanbanData: KanbanBoardType[] = [
  {
    label: "Open",
    table: [],
  },
  {
    label: "In-progress",
    table: [],
  },
  {
    label: "Resolved",
    table: [],
  },
  {
    label: "Closed",
    table: [],
  },
];

function addTaskToStatusGroup(
  data: KanbanBoardType[],
  newTask: TaskInput
): KanbanBoardType[] {
  return data.map((item) => {
    if (item.label !== newTask.taskStatus) {
      return item;
    } else {
      return {
        label: item.label,
        table: [...item.table, newTask],
      };
    }
  });
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
      const dataLater =
        kanbanData && kanbanData.length === 4
          ? addTaskToStatusGroup(kanbanData, dataAddTask)
          : addTaskToStatusGroup(initialKanbanData, dataAddTask);

      await addTaskAction.mutateAsync(dataAddTask);
      onAddTableData([...dataLater]);
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

function TaskableItem({ itemInput }: { itemInput: TaskItem }) {
  return (
    <Draggable
      id={itemInput.taskId}
      className="p-2 bg-gray-100 rounded-md hover:border-blue-500 active:border-gray-100 border border-gray-100 cursor-pointer"
      dataItem={itemInput}
    >
      <p className="text-sm font-medium">{itemInput.title}</p>
      <div className="flex items-center gap-2" id="icon-state">
        <MdOutlineSubject />
        <div className="text-xs">{itemInput.priority}</div>
        <div className="text-xs">{itemInput.storyPoint}</div>
      </div>
    </Draggable>
  );
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
  const [dragOverId, setDragOverId] = useState<TaskStatusType | null | string>(
    null
  );

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks(projectId),
    enabled: true,
  });

  const updateTaskAction = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  const handleDragEnd = async (e: DragEndEvent) => {
    setDragOverId(null);
    if (e?.over?.id && e.over.id !== e.active.data.current?.taskStatus) {
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
          table: createKanbanMap.get("Open") ?? [],
        },
        {
          label: "In-progress",
          table: createKanbanMap.get("In-progress") ?? [],
        },
        {
          label: "Resolved",
          table: createKanbanMap.get("Resolved") ?? [],
        },
        {
          label: "Closed",
          table: createKanbanMap.get("Closed") ?? [],
        },
      ]);
      createKanbanMap.clear();
      await updateTaskAction.mutateAsync(dataInput);
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
            table: createKanbanMap.get("Open") ?? [],
          },
          {
            label: "In-progress",
            table: createKanbanMap.get("In-progress") ?? [],
          },
          {
            label: "Resolved",
            table: createKanbanMap.get("Resolved") ?? [],
          },
          {
            label: "Closed",
            table: createKanbanMap.get("Closed") ?? [],
          },
        ]);
      }
      createKanbanMap.clear();
    }
  }, [kanbanData, queryProjectTasksList]);

  const mouseSensor = useSensor(MouseSensor, {
    onActivation: () => console.log("it trigger!!! mouseSensor"),
    bypassActivationConstraint(props) {
      console.log({ props });
      return true;
    },
    activationConstraint: {
      tolerance: 4000,
      distance: 4000,
      delay: 4000,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    onActivation: () => console.log("it trigger!!! touchSensor"),
    activationConstraint: {
      tolerance: 5,
      delay: 200,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  if (projectId !== "") {
    // console.log({ kanbanData, initialKanbanData });
    return (
      <div className="col-span-8 w-full h-full bg-blue-100">
        <div className="w-full h-[49px]" />
        <DndContext
          onDragEnd={handleDragEnd}
          onDragOver={(e) => setDragOverId((e.over?.id ?? null) as any)}
          sensors={sensors}
        >
          <ul className="grid grid-cols-4 gap-2 px-2 relative h-[calc(100%-49px)]">
            {(kanbanData ?? initialKanbanData).map((table) => {
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
                          <TaskableItem itemInput={item} key={item.taskId} />
                        );
                      })}
                      {dragOverId === table.label && (
                        <div className="rounded-md bg-gray-200 h-[60px] w-full" />
                      )}
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
