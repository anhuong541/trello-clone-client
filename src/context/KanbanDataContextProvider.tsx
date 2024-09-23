import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { KanbanBoardType } from "@/types";

export const KanbanDataContext = createContext<{
  kanbanDataStore: KanbanBoardType | null;
  setKanbanDataStore: Dispatch<SetStateAction<KanbanBoardType | null>>;
}>({ kanbanDataStore: null, setKanbanDataStore: () => {} });

export default function KanbanDataContextProvider({ children }: { children: ReactNode }) {
  const [kanbanDataStore, setKanbanDataStore] = useState<KanbanBoardType | null>(null);

  return (
    <KanbanDataContext.Provider value={{ kanbanDataStore, setKanbanDataStore }}>
      {children}
    </KanbanDataContext.Provider>
  );
}

export const KanbanDataContextHook = () => {
  return useContext(KanbanDataContext);
};
