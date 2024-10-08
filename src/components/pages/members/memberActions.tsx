import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Text,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { OnAddMember, OnDeleteMember } from "@/lib/react-query/query-actions";
import { useDisclosure } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AuthorityType, ProjectUser } from "@/types";
import { queryKeys } from "@/lib/react-query/query-keys";
import useScreenView from "@/hooks/ScreenView";

function AlertDelete({ children, projectId, member }: { children: ReactNode; projectId: string; member: ProjectUser }) {
  const { screenViewType, screenView } = useScreenView();
  const queryClient = useQueryClient();
  const removeMemberAction = OnDeleteMember();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = useRef();

  const handleActionRemoveMember = async () => {
    await removeMemberAction.mutateAsync({ projectId, email: member.email });
    queryClient.refetchQueries({
      queryKey: [queryKeys.viewProjectMember],
    });
    onClose();
  };

  const modalSize = useMemo(() => {
    return screenViewType === "smallMobile" ? "sm" : screenViewType === "superSmallMobile" ? "xs" : "lg";
  }, [screenViewType]);

  const isCentered = screenView ? Number(screenView) < 640 : false;

  return (
    <>
      <Button onClick={onOpen} size="sm" className="flex items-center gap-1" variant="gray">
        {children}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size={modalSize}
        isCentered={isCentered}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className="sm:w-auto">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Member
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>Are you absolutely certain you want to remove this member?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={handleActionRemoveMember}
                variant="destruction"
                className="hover:bg-red-500 hover:text-white"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

function AddMemberModal({
  children,
  projectId,
  isDisable,
}: {
  children: ReactNode;
  projectId: string;
  isDisable: boolean;
}) {
  const { screenViewType, screenView } = useScreenView();
  const queryClient = useQueryClient();
  const addMemberAction = OnAddMember();
  const [inputEmail, setInputEmail] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isErr, setIsErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleActionAddMember = async () => {
    setIsErr(false);
    if (!inputEmail || inputEmail === "") {
      setIsErr(true);
      setErrMsg("Didn't typing email yet!");
      return;
    }

    if (!inputEmail.split("").includes("@")) {
      setIsErr(true);
      setErrMsg("Email is required to add a member!");
      return;
    }

    const defaultAuthority = ["Edit", "View"] as AuthorityType[];

    try {
      await addMemberAction.mutateAsync({
        projectId,
        dataInput: { email: inputEmail, memberAuthority: defaultAuthority },
      });
    } catch (error: any) {
      setIsErr(true);
      setErrMsg(error?.response?.data.error);
      return;
    }
    queryClient.refetchQueries({
      queryKey: [queryKeys.viewProjectMember],
    });
    onClose();
  };

  const modalSize = useMemo(() => {
    return screenViewType === "smallMobile" ? "sm" : screenViewType === "superSmallMobile" ? "xs" : "lg";
  }, [screenViewType]);

  const isCentered = screenView ? Number(screenView) < 640 : false;

  return (
    <>
      <Button onClick={onOpen} size="sm" className="flex gap-2 items-center flex-shrink-0" disabled={isDisable}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered={isCentered}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <label className="flex flex-col gap-1" htmlFor="taskTitle">
              <Text fontSize="sm" fontWeight={600}>
                User Email
              </Text>
              <Input
                type="email"
                placeholder="email@gmail.com"
                className="dark:bg-gray-600"
                onChange={(e) => {
                  e.preventDefault();
                  setInputEmail(e?.target?.value);
                }}
              />
            </label>
            {isErr && <p className="text-sm font-medium text-red-500">{errMsg}</p>}
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleActionAddMember}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ViewMemberInfo({ children, member }: { children: ReactNode; member: ProjectUser }) {
  const { screenViewType, screenView } = useScreenView();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalSize = useMemo(() => {
    return screenViewType === "smallMobile" ? "sm" : screenViewType === "superSmallMobile" ? "xs" : "lg";
  }, [screenViewType]);

  const isCentered = screenView ? Number(screenView) < 640 : false;

  return (
    <>
      <div onClick={onOpen} className="flex items-center gap-4 cursor-pointer group">
        {children}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered={isCentered}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex flex-col">
            {member.username}
            <p className="text-sm text-gray-400">@{member.email}</p>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col gap-2">
            {member.authority.includes("Owner") ? (
              <p>{member.username} is the owner of this project</p>
            ) : (
              <p>
                {member.username} can <strong>{member.authority.join(", ")}</strong>{" "}
              </p>
            )}
          </ModalBody>

          <ModalFooter display="flex" flexDirection="column" justifyContent="end" alignItems="end" gap={1}>
            {/* <p className="text-sm">
              Account created at {dayjs(member.createAt).format("MMM YYYY")}
            </p> */}
            <p className="text-sm">Account created at {dayjs(member.createAt).format("MMM YYYY")}</p>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export { AlertDelete, AddMemberModal, ViewMemberInfo };
