"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { MdAdd, MdOutlineMoreHoriz } from "react-icons/md";

const fakeProjectList = [
  { title: "Project 1" },
  { title: "Project 2" },
  { title: "Project 3" },
];

export default function Sidebar() {
  return (
    <div className="col-span-2 border-r h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Image
          src="/default-avatar.webp"
          alt="avatar"
          height={40}
          width={40}
          className="w-10 h-10 object-contain rounded-full"
        />
        <h2 className="font-medium text-xl">My Project</h2>
      </div>
      <div className="flex flex-col gap-2 h-full py-2">
        <div className="flex items-center justify-between px-4">
          <h3>Project List</h3>
          <Button size="icon" onClick={() => console.log("add new Project")}>
            <MdAdd />
          </Button>
        </div>
        {/* list project */}
        <div className="flex flex-col">
          {fakeProjectList.map((item, index) => {
            return (
              <div className="wrappper relative group" key={index}>
                <div className="flex justify-between w-full items-center px-4 py-2 group-hover:bg-gray-100 cursor-pointer">
                  <p>{item.title}</p>
                </div>
                <Button
                  size="icon"
                  variant="icon"
                  className="absolute top-[50%] -translate-y-1/2 right-4 group-hover:bg-gray-100 hover:!bg-gray-300"
                  onClick={() => console.log("project option")}
                >
                  <MdOutlineMoreHoriz />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
