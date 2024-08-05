import { create } from "zustand";

interface UserStoreState {
  userId: string;
  updateUID: (newUID: string) => void;
}

export const userStore = create<UserStoreState>((set) => ({
  userId: "",
  updateUID: (newUID) => set({ userId: newUID }),
}));
