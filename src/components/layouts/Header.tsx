"use client";

import { UserDataContext, UserType } from "@/context/UserInfoContextProvider";
import { useMutation } from "@tanstack/react-query";
import * as Popover from "@radix-ui/react-popover";
import { useContext, useEffect } from "react";
import { MdLogout } from "react-icons/md";
import Image from "next/image";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";
import { removeSession } from "@/actions/auth-action";

export default function Header({ userInfo }: { userInfo: UserType }) {
  const { setUserDataStore } = useContext(UserDataContext);

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  const handleLogout = async () => {
    await removeSession();
    await logoutAction.mutateAsync();
  };

  useEffect(() => {
    setUserDataStore(userInfo);
  }, [setUserDataStore, userInfo]);

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
      <Popover.Root>
        <Popover.Trigger className="flex justify-end items-center md:gap-4 gap-2 relative hover:opacity-70">
          <p className="font-bold hidden md:block text-black">{userInfo?.username ?? ""}</p>
          <Image
            height={40}
            width={40}
            src="/default-avatar.webp"
            alt="avatar"
            className="w-10 h-10 object-contain rounded-full"
            loading="lazy"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="bottom"
            className="md:translate-x-5 -translate-x-2 z-10 bg-blue-400 text-white hover:bg-blue-300 flex flex-col border rounded-md px-5 py-3"
          >
            <button onClick={handleLogout} className="flex gap-1 items-center">
              <MdLogout className="h-5 w-5" />
              Logout
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </header>
  );
}
