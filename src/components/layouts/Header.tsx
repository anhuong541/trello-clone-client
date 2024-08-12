"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";
import { useRouter } from "next/navigation";

export default function Header() {
  const route = useRouter();
  const [openAvatarOption, setOpenAvatarOption] = useState(false);

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  const handleLogout = async () => {
    await logoutAction.mutateAsync();
    route.push("/login");
    setOpenAvatarOption(false);
  };

  return (
    <header className="h-[70px] bg-blue-200 w-full flex justify-between items-center border-b shadow-sm shadow-white px-4">
      <h1 className="font-bold text-blue-700 text-4xl">Trello Clone</h1>
      <div className="flex justify-end items-center gap-4 relative">
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => setOpenAvatarOption((prev) => (prev = !prev))}
        >
          <Image
            height={40}
            width={40}
            src="/default-avatar.webp"
            alt="avatar"
            className="w-full h-full object-contain rounded-full"
            loading="lazy"
          />
        </Button>
        {openAvatarOption && (
          <div
            className="flex gap-1 items-center absolute top-[120%] cursor-pointer bg-blue-400 text-white hover:bg-blue-300 px-5 py-3 rounded-md"
            onClick={handleLogout}
          >
            <MdLogout className="h-5 w-5" />
            Logout
          </div>
        )}
      </div>
    </header>
  );
}
