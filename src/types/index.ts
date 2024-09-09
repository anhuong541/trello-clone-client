import { FormEventHandler, HTMLInputTypeAttribute } from "react";

export type TaskStatusType = "Open" | "In-progress" | "Resolved" | "Closed";
export type PriorityType = "Low" | "Medium" | "High";
export type AuthorityType = "Edit" | "View" | "Owner";
export type StoryPointType = 1 | 2 | 3 | 5 | 8 | 13 | 21;

export interface TaskItem {
  projectId: string;
  taskId: string;
  title: string;
  description: string;
  taskStatus: TaskStatusType;
  storyPoint: StoryPointType;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}

interface KanbanColumn {
  label: TaskStatusType;
  table: TaskItem[];
}

export type KanbanBoardType = {
  [status in TaskStatusType]: KanbanColumn;
};

export interface AuthFormInput {
  title: string;
  form: {
    register: any;
    id: string;
    type: HTMLInputTypeAttribute;
    placeholder: string;
    err?: boolean;
    errorMsg?: string;
  }[];
  submit: {
    text: string;
    isLoadingSubmit: boolean;
  };
  link: {
    href: string;
    text: string;
  };
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export interface ProjectUser {
  isActive: boolean;
  email: string;
  uid: string;
  activationHash: string | null;
  createAt: number;
  username: string;
  authority: AuthorityType[];
}
