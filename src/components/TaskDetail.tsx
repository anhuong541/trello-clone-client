import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode, useRef } from "react";
import { MdOutlineVideoLabel } from "react-icons/md";
import { TaskItem } from "@/types";
import { TaskDescription } from "./OnTaskChange";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  // console.log({ data });

  const handleClose = () => {
    onClose();
    onCloseIcon && onCloseIcon();
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
            <ModalHeader
              fontSize="lg"
              fontWeight="bold"
              display="flex"
              gap={2}
              alignItems="center"
            >
              <MdOutlineVideoLabel className="w-6 h-6" /> {data.title}
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody
              display="flex"
              flexDirection={"column"}
              gap={4}
              paddingTop={4}
              paddingBottom={4}
            >
              <TaskDescription data={data} />
            </ModalBody>

            <ModalFooter>
              <Button ref={cancelRef} onClick={handleClose} colorScheme="blue">
                Edit
              </Button>
              <Button colorScheme="red" onClick={handleClose} ml={3}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}
