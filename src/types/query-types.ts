import { PriorityType, TaskStatusType } from ".";

export interface RegisterInputType {
  email: string;
  password: string;
  username: string;
}

export interface LoginInputType {
  email: string;
  password: string;
}

export interface ProjectIdAndUserIdInput {
  projectId: string;
  userId: string;
}

export interface CreateProjectInputType {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export interface EditProjectInputType {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export interface TaskInput {
  userId: string;
  projectId: string;
  title: string;
  description: string;
  taskStatus: TaskStatusType;
  storyPoint: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}
