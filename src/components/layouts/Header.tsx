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
  ColorModeScript,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";
import { removeSession } from "@/actions/auth-action";
import CopyText from "../copyText";
import { Button } from "../common/Button";

export default function Header({ userInfo }: { userInfo: UserType }) {
  const { setUserDataStore } = useContext(UserDataContext);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
  }, [setTheme, theme]);

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  console.log({ theme });

  const handleLogout = async () => {
    await removeSession();
    await logoutAction.mutateAsync();
  };

  const changeThemeMode = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  useEffect(() => {
    setUserDataStore(userInfo);
  }, [setUserDataStore, userInfo]);

  return (
    <header className="h-[70px] bg-blue-200 dark:bg-neutral-900 dark:text-white w-full flex justify-between items-center gap-2 px-4">
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
        <Button
          variant="icon"
          className="transition-all duration-200 px-2 hover:bg-inherit"
          onClick={changeThemeMode}
        >
          {theme === "light" ? (
            <MdOutlineLightMode className="h-5 w-5" />
          ) : (
            <MdOutlineDarkMode className="h-5 w-5" />
          )}
        </Button>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <button className="flex items-center gap-2 font-semibold h-full">
              <p className="font-bold hidden md:block text-black dark:text-white">
                {userInfo?.username ?? ""}
              </p>
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
          <PopoverContent width={300} className="dark:bg-gray-700 dark:border-0">
            <PopoverHeader className="overflow-hidden dark:border-0">
              <h4 className="font-semibold px-2">{userInfo?.username}</h4>
              <CopyText text={`@` + userInfo?.email} />
            </PopoverHeader>
            {/* <PopoverBody></PopoverBody> */}
            <PopoverFooter className="bg-white dark:bg-gray-700 flex flex-col !px-1 border-0 rounded-ee-md rounded-es-md">
              <button
                onClick={handleLogout}
                className="flex gap-1 items-center px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800"
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
