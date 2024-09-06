import { ReactNode } from "react";

import UserInfoContextProvider from "./UserInfoContextProvider";
import KanbanDataContextProvider from "./KanbanDataContextProvider";

export default function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserInfoContextProvider>
      <KanbanDataContextProvider>
        {/* <ColorModeScript initialColorMode={theme as any} /> */}
        {children}
      </KanbanDataContextProvider>
    </UserInfoContextProvider>
  );
}
