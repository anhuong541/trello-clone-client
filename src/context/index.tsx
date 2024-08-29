import { ReactNode } from "react";
import UserInfoContextProvider from "./UserInfoContextProvider";
import SocketClientProvider from "./SocketProvider";
import KanbanDataContextProvider from "./KanbanDataContextProvider";

export default function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserInfoContextProvider>
      <SocketClientProvider>
        <KanbanDataContextProvider>{children}</KanbanDataContextProvider>
      </SocketClientProvider>
    </UserInfoContextProvider>
  );
}
