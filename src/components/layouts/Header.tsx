"use client";

import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { useMutation } from "@tanstack/react-query";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogout } from "@/actions/query-actions";

export default function Header({ userInfo }: { userInfo: any }) {
  const route = useRouter();

  const logoutAction = useMutation({
    mutationKey: [reactQueryKeys.logout],
    mutationFn: onUserLogout,
  });

  const handleLogout = async () => {
    await logoutAction.mutateAsync();
    route.push("/login");
  };

  return (
    <header className="h-[70px] bg-blue-200 w-full flex justify-between items-center border-b shadow-sm shadow-white px-4">
      <h1 className="font-bold text-blue-700 text-4xl">Trello Clone</h1>
      <Popover.Root>
        <Popover.Trigger className="flex justify-end items-center gap-4 relative hover:opacity-70">
          <p className="font-bold">{userInfo.data.username}</p>
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
            className="translate-x-5 z-10 bg-blue-400 text-white hover:bg-blue-300 flex flex-col border rounded-md px-5 py-3"
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
