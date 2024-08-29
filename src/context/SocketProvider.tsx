import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";

export const SocketClient = createContext<{
  socketClient: Socket | null;
  setSocketClient: Dispatch<SetStateAction<Socket | null>>;
}>({ socketClient: null, setSocketClient: () => {} });

export default function SocketClientProvider({ children }: { children: ReactNode }) {
  const [socketClient, setSocketClient] = useState<Socket | null>(null);

  return (
    <SocketClient.Provider value={{ socketClient, setSocketClient }}>
      {children}
    </SocketClient.Provider>
  );
}
