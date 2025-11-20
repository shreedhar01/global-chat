import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContextProvider } from "./AuthContext";

interface ISocketContext {
  socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useContext(AuthContextProvider)

  useEffect(() => {
    if(!user){
      if(Socket){
        socket?.disconnect();
        setSocket(null)
      }
      return
    }

    const newSocket = io(import.meta.env.VITE_API_URL,{
        withCredentials:true
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
