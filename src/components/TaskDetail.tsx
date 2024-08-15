import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode, useContext, useRef } from "react";
import { MdDeleteOutline, MdOutlineVideoLabel } from "react-icons/md";
import { TaskItem } from "@/types";
import { TaskDescription, TaskStoryPoint } from "./OnTaskChange";
import { useMutation } from "@tanstack/react-query";
import { onDeleteTaskFunction } from "@/actions/query-actions";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { KanbanDataContext } from "@/context/KanbanDataContextProvider";

export default function TaskDetail({
  children,
  onMouseEnter,
  onMouseLeave,
  onCloseIcon,
  data,
}: {
  children?: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onCloseIcon?: () => void;
  data: TaskItem;
}) {
  const { kanbanDataStore, setKanbanDataStore } = useContext(KanbanDataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDeleteTaskAction = useMutation({
    mutationFn: onDeleteTaskFunction,
    mutationKey: [reactQueryKeys.deleteTask],
  });

  const handleClose = () => {
    onClose();
    onCloseIcon && onCloseIcon();
  };

  const handleDeleteTask = async () => {
    if (kanbanDataStore) {
      let currKanbanDataStore = kanbanDataStore;
      currKanbanDataStore[data.taskStatus].table = currKanbanDataStore[
        data.taskStatus
      ].table.filter((item) => item.taskId !== data.taskId);

      setKanbanDataStore({ ...currKanbanDataStore });

      await onDeleteTaskAction.mutateAsync({
        projectId: data.projectId,
        taskId: data.taskId,
      });
      handleClose();
    }
  };

  // TODO: Update ui after edited

  return (
    <div
      className="absolute top-[25%] -translate-y-1/4 right-2 z-10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        onClick={onOpen}
        size="icon"
        className="px-2 py-2"
        colorScheme="blue"
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay>
          <ModalContent borderRadius={"12px"}>
            <ModalCloseButton />
            <ModalHeader display="flex" flexDirection="column" gap={2}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <MdOutlineVideoLabel className="w-6 h-6" /> {data.title}
              </Text>
              <Text fontSize="small" color="gray">
                This task is from {data.taskStatus} list
              </Text>
            </ModalHeader>
            <ModalBody
              display="flex"
              flexDirection={"column"}
              gap={8}
              paddingTop={4}
              paddingBottom={4}
            >
              <TaskDescription dataInput={data} />
              <TaskStoryPoint dataInput={data} />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                onClick={handleDeleteTask}
                ml={3}
                display={"flex"}
                alignItems={"center"}
                gap={1}
              >
                <MdDeleteOutline className="w-5 h-5" /> Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}
