import { create } from "zustand";

interface UserStoreState {
  userId: string;
  updateUID: (value: string) => void;
  removeUID: (value: string) => void;
}

interface ProjectStoreState {
  projectId: string;
  userId: string;
  projectName: string;
  updateUID: (value: string) => void;
  removeUID: (value: string) => void;
  updateProjectID: (value: string) => void;
  removeProjectID: (value: string) => void;
  updateProjectName: (value: string) => void;
  removeProjectName: (value: string) => void;
}

export const userIdStore = create<UserStoreState>((set) => ({
  userId: "6dc20ab5e14e0f3f3b056f6703375ce6183", // hard code for easy to code :<
  updateUID: (newUID) => set({ userId: newUID }),
  removeUID: () => set({ userId: "" }),
}));

export const projectStore = create<ProjectStoreState>((set) => ({
  userId: "6dc20ab5e14e0f3f3b056f6703375ce6183",
  projectId: "",
  projectName: "...",
  updateUID: (newUID) => set({ userId: newUID }),
  removeUID: () => set({ userId: "" }),
  updateProjectID: (newProjectID) => set({ projectId: newProjectID }),
  removeProjectID: () => set({ projectId: "" }),
  updateProjectName: (newProjectName) => set({ projectName: newProjectName }),
  removeProjectName: () => set({ projectName: "" }),
}));
