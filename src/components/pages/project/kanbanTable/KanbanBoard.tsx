"use client";

import { MdAdd, MdClear, MdOutlineEdit, MdOutlineSubject } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { onChangeTaskState, onCreateNewTask } from "@/actions/query-actions";
import { KanbanBoardType, PriorityType, StoryPointType, TaskItem, TaskStatusType } from "@/types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { TaskInput } from "@/types/query-types";
import { cn, generateNewUid } from "@/lib/utils";
import { Box, Flex, Input, Select } from "@chakra-ui/react";
import { Skeleton, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

import { KanbanDataContext } from "@/context/KanbanDataContextProvider";
import { Draggable, Droppable } from "../../../DragFeat";
import { Button } from "../../../common/Button";
import { TaskDetail } from "../Task";
import SortKanbanTablePopover from "./SortKanbanTablePopove";
import { ablyClient } from "@/providers";
import { server } from "@/lib/network";

interface TaskType {
  taskTitle: string;
  taskDescription: string;
  taskPriority: PriorityType | "";
  taskStoryPoint: StoryPointType | "";
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

export const listTableKey: TaskStatusType[] = ["Open", "In-progress", "Resolved", "Closed"];

const addTaskToStatusGroup = (data: KanbanBoardType, newTask: TaskInput) => {
  let dataReturn = data;
  const selectTaskTable = dataReturn[newTask.taskStatus].table;
  dataReturn[newTask.taskStatus].table = [...selectTaskTable, newTask];
  return dataReturn;
};

function AddTask({
  projectId,
  taskStatus,
  setIsUserAction,
}: {
  projectId: string;
  taskStatus: TaskStatusType;
  setIsUserAction: Dispatch<SetStateAction<boolean>>;
}) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<TaskType>();

  const listStoryPointAccepted = [1, 2, 3, 5, 8, 13, 21];

  const addTaskAction = useMutation({
    mutationKey: [reactQueryKeys.addTask],
    mutationFn: onCreateNewTask,
  });

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    onClose();
    if (data.taskTitle === "") {
      toast.warning("Misisng task title");
      return;
    }
    if (data.taskPriority === "") {
      toast.warning("Misisng task priority");
      return;
    }

    const newTaskId = generateNewUid();
    const dataAddTask: TaskInput = {
      taskId: newTaskId,
      projectId,
      title: data.taskTitle,
      priority: data.taskPriority,
      description: data.taskDescription,
      dueDate: Date.now(),
      startDate: Date.now(),
      taskStatus,
      storyPoint: data.taskStoryPoint === "" ? 1 : data.taskStoryPoint,
    };

    const dataAfter = addTaskToStatusGroup(kanbanDataStore ?? initialKanbanData, dataAddTask);
    setKanbanDataStore(dataAfter);
    setIsUserAction(true);
    queryClient.refetchQueries({ queryKey: [reactQueryKeys.projectList] });
    await addTaskAction.mutateAsync(dataAddTask);
    reset();
  };

  const modalOnClose = () => {
    onClose();
    reset();
  };

  return (
    <>
      <button
        className="py-1 px-2 mt-3 w-full flex items-center gap-1 text-sm hover:bg-blue-300/60 hover:text-blue-800 rounded-md font-bold"
        onClick={onOpen}
      >
        <MdAdd className="h-6 w-6 font-medium" /> Add Task
      </button>

      <Modal isOpen={isOpen} onClose={modalOnClose}>
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent>
          <ModalHeader>Add new task</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody className="flex flex-col gap-2">
              <label className="flex flex-col gap-1" htmlFor="taskTitle">
                <Text fontSize="sm" fontWeight={600}>
                  Title
                </Text>
                <Input placeholder="Task title" type="text" {...register("taskTitle")} />
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskDescription">
                <Text fontSize="sm" fontWeight={600}>
                  Description
                </Text>
                <Textarea placeholder="Task description" {...register("taskDescription")} />
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskPriority">
                <Text fontSize="sm" fontWeight={600}>
                  Priority
                </Text>
                <Select placeholder="Task priority" {...register("taskPriority")}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskStoryPoint">
                <Text fontSize="sm" fontWeight={600}>
                  Story Point
                </Text>
                <Select placeholder="Task story point" {...register("taskStoryPoint")}>
                  {listStoryPointAccepted.map((point) => {
                    return (
                      <option value={point} key={point}>
                        {point}
                      </option>
                    );
                  })}
                </Select>
              </label>
            </ModalBody>

            <ModalFooter display="flex" alignItems="center" justifyContent="end" gap={2}>
              <Button type="submit">Add</Button>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  modalOnClose();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
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
      <Text fontSize="sm" fontWeight={600}>
        {itemInput.title}
      </Text>
      <div className="flex items-center gap-2 font-semibold" id="icon-state">
        {itemInput?.description?.length > 0 && <MdOutlineSubject />}
        <div className="text-xs">{itemInput?.storyPoint}</div>
        <div
          className={cn(
            itemInput.priority === "High"
              ? "text-red-400"
              : itemInput.priority === "Medium"
              ? "text-blue-400"
              : "text-gray-400",
            "text-xs"
          )}
        >
          {itemInput?.priority}
        </div>
      </div>

      {hoverItem && (
        <TaskDetail
          onMouseEnter={() => setDisableDrag(true)}
          onMouseLeave={() => setDisableDrag(false)}
          onCloseIcon={() => {
            setHoverItem(false);
            setDisableDrag(false);
          }}
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
  const [dragOverId, setDragOverId] = useState<TaskStatusType | null | string>(null);
  const [authorized, setAuthorized] = useState<boolean>(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [isUserAction, setIsUserAction] = useState(false);

  const updateTaskAction = useMutation({
    mutationKey: [reactQueryKeys.updateTask],
    mutationFn: onChangeTaskState,
  });

  useEffect(() => {
    if (kanbanDataStore && projectId) {
      setKanbanDataStore(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleDragEnd = async (e: DragEndEvent) => {
    const dragStatus = e.active.data.current?.taskStatus as TaskStatusType;
    setDragOverId(null);
    if (kanbanDataStore && e?.over?.id && e.over.id !== dragStatus) {
      const dataInput: any = {
        ...e.active.data.current,
        taskStatus: e.over?.id,
        dueDate: Date.now(),
      };

      let dataChangeOnDrag: KanbanBoardType = kanbanDataStore;

      const removeDraggingDataFromCurrentTable = kanbanDataStore[dragStatus].table.filter(
        (item) => item.taskId !== dataInput.taskId
      );
      dataChangeOnDrag[dragStatus].table = removeDraggingDataFromCurrentTable;
      dataChangeOnDrag[e.over.id as TaskStatusType].table.push(dataInput);
      setKanbanDataStore(dataChangeOnDrag);
      setIsUserAction(true);
      await updateTaskAction.mutateAsync(dataInput);
      queryClient.refetchQueries({ queryKey: [reactQueryKeys.projectList] });
    }
  };

  useEffect(() => {
    (async () => {
      await server.get(`/joinProjectRoom/${projectId}`);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ablyClient) {
      (async () => {
        ablyClient.channels.get(`view_project_${projectId}`).subscribe(({ data }) => {
          if (data?.error) {
            setAuthorized(false);
            return console.error(data.error);
          }
          setAuthorized(true);
          if (isUserAction) {
            console.log("it stop here");
            setIsUserAction(false);
            return;
          }

          console.log("it trigger view_project!!!");

          const createKanbanMap = new Map();
          data.forEach((item: TaskItem) => {
            const value = createKanbanMap.get(item.taskStatus) ?? [];
            createKanbanMap.set(item.taskStatus, [...value, item]);
          });

          if (data.length > 0) {
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
          setLoadingBoard(false);
        });
      })();

      return () => {
        ablyClient.channels.get(`view_project_${projectId}`).unsubscribe();
      };
    }
  }, [isUserAction, setKanbanDataStore, projectId]);

  if (!authorized && projectId !== "") {
    return (
      <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
        <div className="min-w-[1100px] h-full bg-blue-50">
          <Flex width="100%" height="55px" alignItems="center" className="lg:pl-2 pl-8">
            <p className="text-red-500 font-bold">You are not the member of this project!!!</p>
          </Flex>
          <DndContext
            onDragEnd={handleDragEnd}
            onDragOver={(e) => setDragOverId((e.over?.id ?? null) as any)}
          >
            <ul className="grid grid-cols-4 gap-2 px-2 relative h-[calc(100%-55px)]">
              <SkeletonKanbanBoardTable />
            </ul>
          </DndContext>
        </div>
      </Box>
    );
  }

  return (
    <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
      <div className="min-w-[1100px] h-full bg-blue-50">
        <Flex width="100%" height="55px" alignItems="center" className="lg:pl-2 pl-8">
          {!loadingBoard && <SortKanbanTablePopover />}
        </Flex>

        <DndContext
          onDragEnd={handleDragEnd}
          onDragOver={(e) => setDragOverId((e.over?.id ?? null) as any)}
        >
          <ul className="grid grid-cols-4 gap-2 px-2 pb-2 relative h-[calc(100%-55px)]">
            {loadingBoard ? (
              <SkeletonKanbanBoardTable />
            ) : (
              listTableKey.map((key: TaskStatusType) => {
                const table = (kanbanDataStore ?? initialKanbanData)[key];

                if (!table?.label)
                  return (
                    <p key={key} className="text-red-500 font-medium">
                      data table error
                    </p>
                  );

                return (
                  <Droppable className="flex flex-col h-full" key={table.label} id={table.label}>
                    <div className="flex-col px-2 py-2 bg-blue-200 rounded-lg">
                      <h4 className="p-2 font-bold">{table.label}</h4>
                      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-235px)]">
                        {(table.table ?? []).map((item: TaskItem) => {
                          return <TaskDrableItem itemInput={item} key={item.taskId} />;
                        })}
                        {dragOverId === table.label && (
                          <div className="rounded-md bg-gray-200 h-[60px] w-full" />
                        )}
                      </div>
                      <AddTask
                        projectId={projectId}
                        taskStatus={table.label}
                        setIsUserAction={setIsUserAction}
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
