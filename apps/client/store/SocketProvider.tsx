"use client";

import { createContext, useCallback } from "react";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextI {
  sendMessage: (message: string) => any;
}

const SocketContext = createContext<SocketContextI | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const sendMessage: SocketContextI["sendMessage"] = useCallback((message) => {
    console.log("Sending message: ", message);
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
