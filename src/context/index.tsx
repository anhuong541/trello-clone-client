import { ReactNode } from "react";

import UserInfoContextProvider from "./UserInfoContextProvider";
import KanbanDataContextProvider from "./KanbanDataContextProvider";

export default function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserInfoContextProvider>
      <KanbanDataContextProvider>{children}</KanbanDataContextProvider>
    </UserInfoContextProvider>
  );
}
