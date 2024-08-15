import { KanbanBoardType } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export const KanbanDataContext = createContext<{
  kanbanDataStore: KanbanBoardType | null;
  setKanbanDataStore: Dispatch<SetStateAction<KanbanBoardType | null>>;
}>({ kanbanDataStore: null, setKanbanDataStore: () => {} });

export default function KanbanDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [kanbanDataStore, setKanbanDataStore] =
    useState<KanbanBoardType | null>(null);

  return (
    <KanbanDataContext.Provider value={{ kanbanDataStore, setKanbanDataStore }}>
      {children}
    </KanbanDataContext.Provider>
  );
}
