import { create } from "zustand";

interface UserStoreState {
  userId: string;
  updateUID: (value: string) => void;
  removeUID: (value: string) => void;
}

// userid: 6dc20ab5e14e0f3f3b056f6703375ce6183
// userid 2: 518df0473a0c6ad7f1375062fc6dfe54333

export const userIdStore = create<UserStoreState>((set) => ({
  userId: "", // hard code for easy to code :<
  updateUID: (newUID) => set({ userId: newUID }),
  removeUID: () => set({ userId: "" }),
}));
