"use client";

import { UserDataContext, UserType } from "@/context/UserInfoContextProvider";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { MdLightMode, MdLogout, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";
import { removeSession } from "@/actions/auth-action";
import CopyText from "../copyText";

export default function Header({ userInfo }: { userInfo: UserType }) {
  const { setUserDataStore } = useContext(UserDataContext);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
  }, [theme]);

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  console.log({ theme });

  const handleLogout = async () => {
    await removeSession();
    // socketClient && socketClient.emit("user_disconnect");
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
      <div className="flex items-center justify-end gap-2">
        {/* <Button
          variant="ghost"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          className="transition-all duration-200"
        > */}
        {theme === "light" ? (
          <MdOutlineLightMode className="h-5 w-5" onClick={() => setTheme("dark")} />
        ) : (
          <MdOutlineDarkMode className="h-5 w-5" onClick={() => setTheme("light")} />
        )}
        {/* </Button> */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <button className="flex items-center gap-2 font-semibold h-full">
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
      </div>
    </header>
  );
}
