import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode, useMemo } from "react";
import dayjs from "dayjs";
import { TaskItem } from "@/types";
import { TaskDescription, TaskPriority, TaskStoryPoint, TaskTitle } from "./OnTaskChange";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OnDeleteTask } from "@/lib/react-query/query-actions";
import { queryKeys } from "@/lib/react-query/query-keys";
import useScreenView from "@/hooks/ScreenView";
import UpdateTaskStatus from "./UpdateTaskStatus";
import { Button } from "@/components/common/Button";
import { toast } from "react-toastify";

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
  const queryClient = useQueryClient();
  const { screenViewType } = useScreenView();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDeleteTaskAction = OnDeleteTask();

  const handleClose = () => {
    onClose();
    onCloseIcon && onCloseIcon();
  };

  const handleDeleteTask = async () => {
    const res: any = await onDeleteTaskAction.mutateAsync({
      projectId: data.projectId,
      taskId: data.taskId,
    });
    handleClose();

    if (res?.response?.status === 401) {
      toast.error("Oops! It looks like you're not authorized to delete this task");
    }
  };

  const modalSize = useMemo(() => {
    return screenViewType === "smallMobile" ? "sm" : screenViewType === "superSmallMobile" ? "xs" : "lg";
  }, [screenViewType]);

  return (
    <div
      className="absolute top-[25%] -translate-y-1/4 right-2 z-10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button onClick={onOpen} size="icon" variant="gray" className="px-2 py-2">
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} size={modalSize}>
        <ModalOverlay>
          <ModalContent borderRadius="12px">
            <ModalCloseButton />
            <ModalHeader display="flex" flexDirection="column" gap={2}>
              <TaskTitle dataInput={data} />
              <Flex flexDirection="column">
                <div className="text-sm text-[#808080]">
                  This task is from <UpdateTaskStatus dataInput={data} /> list
                </div>
                <Text fontSize="small" color="gray">
                  Created at {dayjs(data.startDate).format("DD-MM-YYYY")}
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody display="flex" flexDirection="column" gap={8} paddingTop={4} paddingBottom={4}>
              <TaskDescription dataInput={data} />
              <TaskStoryPoint dataInput={data} />
              <TaskPriority dataInput={data} />
            </ModalBody>

            <ModalFooter className="flex items-center justify-end gap-2">
              <Button
                color="white"
                onClick={() => {
                  handleClose();
                  queryClient.refetchQueries({
                    queryKey: [queryKeys.projectList],
                  });
                }}
              >
                Done
              </Button>
              <Button variant="destruction" onClick={handleDeleteTask}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}
