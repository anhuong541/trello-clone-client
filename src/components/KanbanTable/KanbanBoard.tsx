"use client";

import {
  MdAdd,
  MdClear,
  MdOutlineEdit,
  MdOutlineSubject,
} from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
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

import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Draggable, Droppable } from "../DragFeat";
import TaskDetail from "../Task/TaskDetail";
import { KanbanDataContext } from "@/context/KanbanDataContextProvider";
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import SortKanbanTablePopover from "./SortKanbanTablePopove";

interface TaskType {
  taskTitle: string;
}

const initialKanbanData: KanbanBoardType = {
  Open: {
    label: "Open",
    table: [],
  },
  "In-progress": {
    label: "In-progress",
    table: [],
  },
  Resolved: {
    label: "Resolved",
    table: [],
  },
  Closed: {
    label: "Closed",
    table: [],
  },
};

export const listTableKey: TaskStatusType[] = [
  "Open",
  "In-progress",
  "Resolved",
  "Closed",
];

const addTaskToStatusGroup = (data: KanbanBoardType, newTask: TaskInput) => {
  let dataReturn = data;
  const newTaskTable = dataReturn[newTask.taskStatus].table;
  dataReturn[newTask.taskStatus].table = [...newTaskTable, newTask];
  return dataReturn;
};

function AddTask({
  projectId,
  taskStatus,
  onAddTableData,
  kanbanData,
}: {
  projectId: string;
  taskStatus: TaskStatusType;
  onAddTableData: any;
  kanbanData: KanbanBoardType;
}) {
  const queryClient = useQueryClient();
  const [openAddTask, setOpenAddTask] = useState(false);
  const { register, handleSubmit, watch, reset, setFocus } =
    useForm<TaskType>();

  const addTaskAction = useMutation({
    mutationKey: [reactQueryKeys.addTask],
    mutationFn: onCreateNewTask,
  });

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    if (data.taskTitle !== "") {
      const newTaskId = generateNewUid();
      const dataAddTask: TaskInput = {
        taskId: newTaskId,
        projectId,
        title: data.taskTitle,
        priority: "Low", // auto Low edit next time
        description: "",
        dueDate: Date.now(),
        startDate: Date.now(),
        taskStatus, // need to change after create by status take from props
        storyPoint: 1,
      };

      setOpenAddTask(false);
      const dataLater = addTaskToStatusGroup(kanbanData, dataAddTask);
      onAddTableData({ ...dataLater }); // check if got some error
      await addTaskAction.mutateAsync(dataAddTask);
      queryClient.refetchQueries({ queryKey: [reactQueryKeys.projectList] });
      reset();
    }
  };

  useEffect(() => {
    if (openAddTask) {
      setFocus("taskTitle");
    }
  }, [openAddTask, setFocus]);

  if (openAddTask) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-3"
      >
        <Input {...register("taskTitle")} placeholder="Task name" />
        <div className="flex items-center gap-2">
          <Button type="submit" className="w-[80px]" size={"sm"}>
            Add
          </Button>
          <Button
            size={"sm"}
            className="bg-blue-200 text-blue-800 hover:bg-blue-300 px-2"
            onClick={() => {
              setOpenAddTask(false);
              reset();
            }}
          >
            <MdClear className="w-6 h-6" />
          </Button>
        </div>
      </form>
    );
  } else {
    return (
      <button
        className="py-1 px-2 mt-3 w-full flex items-center gap-1 text-sm hover:bg-blue-300 hover:text-blue-800 rounded-md font-bold"
        onClick={() => setOpenAddTask(true)}
      >
        <MdAdd className="h-6 w-6 font-medium" /> Add Task
      </button>
    );
  }
}

function TaskDrableItem({ itemInput }: { itemInput: TaskItem }) {
  const [hoverItem, setHoverItem] = useState(false);
  const [disableDrag, setDisableDrag] = useState(false);

  return (
    <Draggable
      id={itemInput.taskId}
      className="relative p-2 bg-gray-100 rounded-md border border-gray-100 hover:border-blue-500 active:border-gray-100 cursor-pointer"
      dataItem={itemInput}
      disableDrag={disableDrag}
      onMouseEnter={() => setHoverItem(true)}
      onMouseLeave={() => setHoverItem(false)}
    >
      <Text fontSize={"sm"} fontWeight={600}>
        {itemInput.title}
      </Text>
      <div className="flex items-center gap-2" id="icon-state">
        {itemInput?.description.length > 0 && <MdOutlineSubject />}
        <div className="text-xs">{itemInput.priority}</div>
        <div className="text-xs">{itemInput.storyPoint}</div>
      </div>

      {hoverItem && (
        <TaskDetail
          onMouseEnter={() => setDisableDrag(true)}
          onMouseLeave={() => setDisableDrag(false)}
          onCloseIcon={() => setHoverItem(false)}
          data={itemInput}
        >
          <MdOutlineEdit />
        </TaskDetail>
      )}
    </Draggable>
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const [dragOverId, setDragOverId] = useState<TaskStatusType | null | string>(
    null
  );

  const queryProjectTasksList = useQuery({
    queryKey: [projectId, reactQueryKeys.viewProjectTasks],
    queryFn: async () => await handleViewProjectTasks(projectId),
  });

  const updateTaskAction = useMutation({
    mutationFn: onChangeTaskState,
    mutationKey: [reactQueryKeys.updateTask],
  });

  useEffect(() => {
    if (kanbanDataStore && projectId) {
      setKanbanDataStore(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleDragEnd = async (e: DragEndEvent) => {
    setDragOverId(null);
    if (
      kanbanDataStore &&
      e?.over?.id &&
      e.over.id !== e.active.data.current?.taskStatus
    ) {
      const dataInput: any = {
        ...e.active.data.current,
        taskStatus: e.over?.id,
        dueDate: Date.now(),
      };

      console.log({ dataInput });
      const createKanbanMap = new Map();
      let dataChangeOnDrag: KanbanBoardType = kanbanDataStore;

      dataChangeOnDrag[
        e.active.data.current?.taskStatus as TaskStatusType
      ].table = kanbanDataStore[
        e.active.data.current?.taskStatus as TaskStatusType
      ].table.filter((item) => item.taskId !== dataInput.taskId);

      dataChangeOnDrag[e.over.id as TaskStatusType].table.push(dataInput);

      setKanbanDataStore({ ...dataChangeOnDrag });
      createKanbanMap.clear();
      queryClient.refetchQueries({ queryKey: [reactQueryKeys.projectList] });
      await updateTaskAction.mutateAsync(dataInput);
    }
  };

  useEffect(() => {
    if (!kanbanDataStore) {
      const createKanbanMap = new Map();
      const projectTasksList = queryProjectTasksList.data?.data?.data ?? [];
      const filterProject = projectTasksList.forEach((item: TaskItem) => {
        const value = createKanbanMap.get(item.taskStatus) ?? [];
        createKanbanMap.set(item.taskStatus, [...value, item]);
      });

      if (projectTasksList.length > 0) {
        setKanbanDataStore({
          Open: {
            label: "Open",
            table: createKanbanMap.get("Open") ?? [],
          },
          "In-progress": {
            label: "In-progress",
            table: createKanbanMap.get("In-progress") ?? [],
          },
          Resolved: {
            label: "Resolved",
            table: createKanbanMap.get("Resolved") ?? [],
          },
          Closed: {
            label: "Closed",
            table: createKanbanMap.get("Closed") ?? [],
          },
        });
      }
      createKanbanMap.clear();
    }
  }, [
    kanbanDataStore,
    queryProjectTasksList.data?.data?.data,
    queryProjectTasksList.isFetching,
    setKanbanDataStore,
  ]);

  if (projectId !== "") {
    return (
      <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
        <div className="min-w-[1100px] h-full bg-blue-100">
          <Flex
            width={"100%"}
            height="55px"
            alignItems={"center"}
            className="lg:pl-2 pl-8"
          >
            {!queryProjectTasksList.isLoading && <SortKanbanTablePopover />}
          </Flex>

          <DndContext
            onDragEnd={handleDragEnd}
            onDragOver={(e) => setDragOverId((e.over?.id ?? null) as any)}
          >
            <ul className="grid grid-cols-4 gap-2 px-2 relative h-[calc(100%-55px)]">
              {queryProjectTasksList.isLoading ? (
                <SkeletonKanbanBoardTable />
              ) : (
                listTableKey.map((key: TaskStatusType) => {
                  const table = (kanbanDataStore ?? initialKanbanData)[key];
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
                              <TaskDrableItem
                                itemInput={item}
                                key={item.taskId}
                              />
                            );
                          })}
                          {dragOverId === table.label && (
                            <div className="rounded-md bg-gray-200 h-[60px] w-full" />
                          )}
                        </div>
                        <AddTask
                          projectId={projectId}
                          taskStatus={table.label}
                          onAddTableData={setKanbanDataStore}
                          kanbanData={kanbanDataStore ?? initialKanbanData}
                        />
                      </div>
                    </Droppable>
                  );
                })
              )}
            </ul>
          </DndContext>
        </div>
      </Box>
    );
  }
}

const dataEx = [
  ["", "", "", "", ""],
  ["", "", "", ""],
  ["", "", ""],
  ["", "", "", ""],
];

function SkeletonKanbanBoardTable() {
  return ["", "", "", ""].map((_: string, index: number) => {
    return (
      <div key={index}>
        <div className="flex flex-col gap-3 px-2 py-2 bg-blue-200 rounded-lg">
          <Skeleton height="30px" borderRadius={8} />
          <div className="flex flex-col gap-3">
            {dataEx[index].map((_: string, idx: number) => {
              if (idx === dataEx[index].length - 1) {
                return <Skeleton key={idx} height="40px" borderRadius={8} />;
              }
              return <Skeleton key={idx} height="60px" borderRadius={8} />;
            })}
          </div>
        </div>
      </div>
    );
  });
}
