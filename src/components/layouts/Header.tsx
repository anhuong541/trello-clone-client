"use client";

import { UserDataContext, UserType } from "@/context/UserInfoContextProvider";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
} from "@chakra-ui/react";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";
import { removeSession } from "@/actions/auth-action";
import { socket } from "@/lib/socket";
import CopyText from "../copyText";

export default function Header({ userInfo }: { userInfo: UserType }) {
  const { setUserDataStore } = useContext(UserDataContext);

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  const handleLogout = async () => {
    await removeSession();
    socket.emit("user_disconnect");
    await logoutAction.mutateAsync();
  };

  useEffect(() => {
    setUserDataStore(userInfo);
  }, [setUserDataStore, userInfo]);

  console.log({ userInfo });

  return (
    <header className="h-[70px] bg-blue-200 w-full flex justify-between items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        <Image
          height={40}
          width={40}
          src="/trello-logo.png"
          alt="avatar"
          className="w-10 h-10 object-contain"
          loading="lazy"
        />
        <h1 className="font-bold text-title-header md:text-4xl text-2xl">Trello Clone</h1>
      </div>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <button className="flex items-center gap-1 font-semibold h-full">
            <p className="font-bold hidden md:block text-black">{userInfo?.username ?? ""}</p>
            <Image
              height={40}
              width={40}
              src="/default-avatar.webp"
              alt="avatar"
              className="w-10 h-10 object-contain rounded-full"
              loading="lazy"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent width={300}>
          <PopoverHeader className="overflow-hidden">
            <h4 className="font-semibold px-2">{userInfo?.username}</h4>
            <CopyText text={`@` + userInfo?.email} />
          </PopoverHeader>
          {/* <PopoverBody></PopoverBody> */}
          <PopoverFooter className="bg-white flex flex-col rounded-md">
            <button
              onClick={handleLogout}
              className="flex gap-1 items-center px-2 py-2 hover:bg-gray-100"
            >
              <MdLogout className="h-5 w-5" />
              Logout
            </button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </header>
  );
}
