"use client";

import { Dispatch, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdAdd, MdClear, MdOutlineEdit, MdOutlineSubject } from "react-icons/md";
import { OnCreateNewTask, OnEditTask } from "@/lib/react-query/query-actions";
import { SubmitHandler, useForm } from "react-hook-form";
import { KanbanBoardType, PriorityType, StoryPointType, TaskItem, TaskStatusType } from "@/types";
import { queryKeys } from "@/lib/react-query/query-keys";
import { TaskInput } from "@/types/query-types";
import { cn, generateNewUid } from "@/lib/utils";
import { Box, Flex, Input, Select, Tooltip } from "@chakra-ui/react";
import { Skeleton, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { KanbanDataContextHook } from "@/context/KanbanDataContextProvider";
import { Button } from "../../../common/Button";
import { TaskDetail } from "../Task";
import SortKanbanTablePopover from "./SortKanbanTablePopove";
import { ablyClient } from "@/providers";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import UseThrottle from "@/hooks/Throttle";
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

const handleChangeDataBoardAfterDragEnd = (source: any, destination: any, columns: KanbanBoardType) => {
  if (source?.droppableId !== destination?.droppableId) {
    const sourceColumn = columns[source?.droppableId as TaskStatusType];
    const destColumn = columns[destination?.droppableId as TaskStatusType];
    const sourceTable = [...sourceColumn.table];
    const destTable = [...destColumn.table];
    const [removed] = sourceTable.splice(source?.index, 1);
    destTable.splice(destination?.index, 0, removed);

    // console.log("logic 1");
    return {
      ...columns,
      [source?.droppableId]: {
        ...sourceColumn,
        table: sourceTable,
      },
      [destination?.droppableId]: {
        ...destColumn,
        table: destTable,
      },
    };
  } else {
    const column = columns[source?.droppableId as TaskStatusType];
    const copiedTable = [...column.table];
    const [removed] = copiedTable.splice(source?.index, 1);
    copiedTable.splice(destination?.index, 0, removed);
    // console.log("logic 2");
    return {
      ...columns,
      [source?.droppableId]: {
        ...column,
        table: copiedTable,
      },
    };
  }
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
  const { kanbanDataStore, setKanbanDataStore } = KanbanDataContextHook();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm<TaskType>();

  const listStoryPointAccepted = [1, 2, 3, 5, 8, 13, 21];
  const addTaskAction = OnCreateNewTask();

  // console.log({ kanbanDataStore });

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

    // const positionId = kanbanDataStore ? kanbanDataStore[taskStatus].table.length : 0;

    const newTaskId = generateNewUid();
    const dataAddTask: TaskInput = {
      taskId: newTaskId,
      projectId,
      // positionId,
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
    queryClient.refetchQueries({ queryKey: [queryKeys.projectList] });
    const res = await addTaskAction.mutateAsync(dataAddTask);
    if (!res) {
      toast.error("Project have been removed");
    }
    reset();
  };

  const modalOnClose = () => {
    onClose();
    reset();
  };

  return (
    <>
      <button
        className="py-1 px-2 mt-3 w-full flex items-center gap-1 text-sm hover:bg-blue-300/60 dark:hover:bg-gray-600 dark:hover:text-gray-300 hover:text-blue-800 rounded-md font-bold"
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
                <Input placeholder="Task title" type="text" {...register("taskTitle")} className="dark:bg-gray-600" />
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskDescription">
                <Text fontSize="sm" fontWeight={600}>
                  Description
                </Text>
                <Textarea
                  placeholder="Task description"
                  {...register("taskDescription")}
                  className="dark:bg-gray-600"
                />
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskPriority">
                <Text fontSize="sm" fontWeight={600}>
                  Priority
                </Text>
                <Select placeholder="Task priority" {...register("taskPriority")} className="dark:bg-gray-600">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
                <Text color="red" fontSize={12}>
                  Priority is required!
                </Text>
              </label>
              <label className="flex flex-col gap-1" htmlFor="taskStoryPoint">
                <Text fontSize="sm" fontWeight={600}>
                  Story Point
                </Text>
                <Select placeholder="Task story point" {...register("taskStoryPoint")} className="dark:bg-gray-600">
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
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  modalOnClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function TooltipDes({ children, label }: { children: ReactNode; label: string }) {
  const [mouseOver, setMouseOver] = useState(false);
  const [position, setPosition] = useState<any>({ top: null, left: null });
  return (
    <div
      className="relative cursor-default"
      onMouseEnter={(e) => {
        setPosition({
          top: e.clientY + 15,
          left: e.clientX,
        });
        setMouseOver(true);
      }}
      onMouseLeave={() => setMouseOver(false)}
    >
      {mouseOver && (
        <div
          className={cn(
            position?.left && "fixed",
            "font-medium px-2 py-1 text-sm whitespace-nowrap -translate-x-1/2 bg-slate-400 text-white shadow-sm rounded-md"
          )}
          style={{ top: position?.top ?? 0, left: position?.left ?? 0, zIndex: 999 }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function TaskDrableItem({
  itemInput,
  id,
  index,
  selectedDragItem,
}: {
  itemInput: TaskItem;
  id?: string;
  index: number;
  selectedDragItem: MutableRefObject<TaskItem | null>;
}) {
  const [hoverItem, setHoverItem] = useState(false);
  const [disableDrag, setDisableDrag] = useState(false);

  return (
    <Draggable draggableId={id ? id : itemInput.taskId} index={index} isDragDisabled={disableDrag}>
      {(provided, snapshot) => {
        selectedDragItem.current = itemInput; //  this is for saving the selected drag itemData

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              position: snapshot.isDragging ? "fixed" : "relative",
              userSelect: "none",
              marginTop: index === 0 ? 0 : 12,
              ...provided.draggableProps.style,
            }}
            className="space-y-2 relative p-2 text-black bg-gray-100 rounded-md border border-gray-100 hover:border-blue-500 active:border-gray-100 cursor-pointer"
            onMouseEnter={() => setHoverItem(true)}
            onMouseLeave={() => setHoverItem(false)}
          >
            <Text fontSize="sm" fontWeight={600}>
              {itemInput.title}
            </Text>
            <div className="flex items-center gap-2 font-semibold text-xs" id="icon-state">
              {itemInput?.description?.length > 0 && (
                <TooltipDes label="Card have a description">
                  <MdOutlineSubject />
                </TooltipDes>
              )}
              <p>{itemInput?.storyPoint}</p>
              {/* <p>{`${itemInput?.taskStatus}_${itemInput?.positionId}`}</p> */}
              <p
                className={cn(
                  itemInput.priority === "High"
                    ? "text-red-400"
                    : itemInput.priority === "Medium"
                    ? "text-blue-400"
                    : "text-gray-400"
                )}
              >
                {itemInput?.priority}
              </p>
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
          </div>
        );
      }}
    </Draggable>
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { kanbanDataStore, setKanbanDataStore } = KanbanDataContextHook();
  const [authorized, setAuthorized] = useState<boolean>(true);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [isUserAction, setIsUserAction] = useState(false);
  const dataSelectedDragItem = useRef<TaskItem | null>(null);

  const updateTaskAction = OnEditTask();

  useEffect(() => {
    if (kanbanDataStore && projectId) {
      setKanbanDataStore(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const debouncedUpdateBoard = UseThrottle(async (dataInput: TaskItem) => {
    const res: any = await updateTaskAction.mutateAsync(dataInput);
    if (res?.response?.status === 401) {
      setAuthorized(false);
    }
  }, 1000);

  const handleDragEnd = async (e: DropResult) => {
    if (!dataSelectedDragItem.current || !kanbanDataStore) {
      return;
    }

    if (!e.source?.droppableId || !e.destination?.droppableId) {
      return;
    }

    const dataInput: TaskItem = {
      ...dataSelectedDragItem.current,
      // positionIndex: 0,
      taskStatus: e.destination?.droppableId as TaskStatusType,
      dueDate: Date.now(),
    };

    let dataChangeOnDrag: KanbanBoardType = handleChangeDataBoardAfterDragEnd(e.source, e.destination, kanbanDataStore);
    setKanbanDataStore({ ...dataChangeOnDrag });

    if (e.destination?.droppableId !== e.source?.droppableId) {
      setIsUserAction(true);
      debouncedUpdateBoard(dataInput);
    }
    queryClient.refetchQueries({ queryKey: [queryKeys.projectList] });
  };

  useEffect(() => {
    const callViewProjectTasks = async (projectId: string) => {
      if (projectId === "") {
        return { data: [] };
      }
      return await server.get(`/task/${projectId}`);
    };

    callViewProjectTasks(projectId);
  });

  useEffect(() => {
    if (!ablyClient) {
      toast.error("socket error");
      return;
    }

    (async () => {
      ablyClient.channels.get(`view_project_${projectId}`).subscribe(({ data }) => {
        if (data?.error) {
          setAuthorized(false);
          return console.error(data.error);
        }
        setAuthorized(true);
        if (isUserAction) {
          console.log("user action");
          setIsUserAction(false);
          if (data.dataLength > 0) {
            return;
          }
        }

        setKanbanDataStore(data.dataBoard);
        setLoadingBoard(false);
      });
    })();

    return () => {
      ablyClient.channels.get(`view_project_${projectId}`).unsubscribe();
    };
  }, [isUserAction, setKanbanDataStore, projectId]);

  if (!authorized && projectId !== "") {
    return (
      <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
        <div className="min-w-[1100px] h-full bg-blue-50 dark:bg-gray-400">
          <Flex width="100%" height="55px" alignItems="center" className="lg:pl-2 pl-8">
            <p className="text-red-500 font-bold">You are not the member of this project!!!</p>
          </Flex>
          <ul className="grid grid-cols-4 gap-2 px-2 relative h-[calc(100%-55px)]">
            <SkeletonKanbanBoardTable />
          </ul>
        </div>
      </Box>
    );
  }

  return (
    <Box className="lg:col-span-8 overflow-x-auto overflow-y-hidden h-full w-full">
      <div className="min-w-[1100px] h-full bg-blue-50 dark:bg-gray-400">
        <Flex width="100%" height="55px" alignItems="center" className="lg:pl-2 pl-8">
          {!loadingBoard && <SortKanbanTablePopover />}
        </Flex>

        <DragDropContext onDragEnd={handleDragEnd}>
          <ul className="grid grid-cols-4 gap-2 px-2 pb-2 relative h-[calc(100%-55px)] overflow-hidden">
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
                  <Droppable key={table.label} droppableId={table.label}>
                    {(provided) => {
                      return (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col h-full">
                          <div className="flex-col py-2 bg-blue-200 dark:bg-gray-700 rounded-lg">
                            <h4 className="py-2 px-4 font-bold">{table.label}</h4>
                            <div className="flex flex-col max-h-[calc(100vh-230px)] px-2 custom-scrollbar overflow-y-auto">
                              {(table.table ?? []).map((item: TaskItem, index: number) => {
                                return (
                                  <TaskDrableItem
                                    itemInput={item}
                                    key={item.taskId}
                                    index={index}
                                    selectedDragItem={dataSelectedDragItem}
                                  />
                                );
                              })}
                              {provided.placeholder}
                            </div>
                            <AddTask projectId={projectId} taskStatus={table.label} setIsUserAction={setIsUserAction} />
                          </div>
                        </div>
                      );
                    }}
                  </Droppable>
                );
              })
            )}
          </ul>
        </DragDropContext>
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
        <div className="flex flex-col gap-3 px-2 py-2 bg-blue-200 dark:bg-gray-700 rounded-lg">
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
