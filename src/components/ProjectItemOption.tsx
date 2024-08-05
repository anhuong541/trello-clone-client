import * as Popover from "@radix-ui/react-popover";
import { MdOutlineClose, MdOutlineMoreHoriz } from "react-icons/md";

const listProjectItenOption = [
  { label: "Edit", action: () => {} },
  { label: "Delete", action: () => {} },
];

export default function ProjectItemOption({
  projectTitle,
}: {
  projectTitle: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger className="h-10 w-10 flex justify-center items-center">
        <MdOutlineMoreHoriz />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="right"
          className="translate-x-5 flex flex-col border rounded-md py-2 w-[230px]"
        >
          <div className="flex justify-center px-4 relative">
            <h4 className="py-2 font-bold text-sm text-center">
              {projectTitle}
            </h4>
            <Popover.Close className="absolute top-0 right-2 hover:bg-gray-100 p-2 rounded-md">
              <MdOutlineClose />
            </Popover.Close>
          </div>
          {listProjectItenOption.map((item, index) => {
            return (
              <button
                key={index}
                className="hover:bg-gray-100 active:opacity-60 rounded-md px-4 py-2"
                onClick={item.action}
              >
                {item.label}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
