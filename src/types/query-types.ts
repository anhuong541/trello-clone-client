import { AuthorityType, PriorityType, TaskStatusType } from ".";

export interface RegisterInputType {
  email: string;
  password: string;
  username: string;
}

export interface LoginInputType {
  email: string;
  password: string;
}

export interface CreateProjectInputType {
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export interface EditProjectInputType {
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export interface TaskInput {
  taskId: string;
  projectId: string;
  positionId: string;
  title: string;
  description: string;
  taskStatus: TaskStatusType;
  storyPoint: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}

export type MemberAuthorityType = {
  email: string;
  memberAuthority: AuthorityType[];
};
