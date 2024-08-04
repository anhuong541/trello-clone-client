"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { MdLogout } from "react-icons/md";
import { handleUserSignOut } from "@/actions/firebase-actions";

export default function Header() {
  return (
    <header className="h-[70px] w-full flex justify-between items-center border-b shadow-sm px-4">
      <h1 className="font-bold text-blue-500 text-4xl">Trello Clone</h1>
      <div className="flex justify-end items-center gap-4">
        <Button size="sm" className="flex gap-1" onClick={handleUserSignOut}>
          <MdLogout className="h-5 w-5" />
          Logout
        </Button>
        <div className="h-10 w-10">
          <Image
            height={40}
            width={40}
            src="/default-avatar.webp"
            alt="avatar"
            className="w-full h-full rounded-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </header>
  );
}
