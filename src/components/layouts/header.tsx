"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { MdLogout } from "react-icons/md";
import { handleUserSignOut } from "@/actions/firebase-actions";
import { useState } from "react";

export default function Header() {
  const [openAvatarOption, setOpenAvatarOption] = useState(false);
  return (
    <header className="h-[70px] w-full flex justify-between items-center border-b shadow-sm px-4">
      <h1 className="font-bold text-blue-500 text-4xl">Trello Clone</h1>
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
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </Button>
        {openAvatarOption && (
          <Button
            size="sm"
            className="flex gap-1 absolute ring-0 top-[120%]"
            onClick={handleUserSignOut}
          >
            <MdLogout className="h-5 w-5" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
