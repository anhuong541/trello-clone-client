export type TaskStatusType = "Open" | "In-progress" | "Resolved" | "Closed";
export type PriorityType = "Low" | "Medium" | "High";

export interface TaskItem {
  projectId: string;
  taskId: string;
  title: string;
  description: string;
  taskStatus: TaskStatusType;
  storyPoint: 1 | 2 | 3 | 5 | 8 | 13 | 21;
  startDate: number;
  dueDate: number;
  priority: PriorityType;
}

export interface KanbanBoardType {
  label: TaskStatusType;
  table: TaskItem[];
}
