import { create } from "zustand";

interface UserStoreState {
  userId: string;
  updateUID: (newUID: string) => void;
}

export const userIdStore = create<UserStoreState>((set) => ({
  userId: "6dc20ab5e14e0f3f3b056f6703375ce6183", // hard code for easy to code :<
  updateUID: (newUID) => set({ userId: newUID }),
  removeUID: () => set({ userId: "" }),
}));
