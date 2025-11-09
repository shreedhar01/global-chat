import React from "react";
import { ThemeContext } from "./ThemeContext";
import { AuthContext } from "./AuthContext";
import { SocketProvider } from "./SocketContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeContext>
            <AuthContext>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </AuthContext>
        </ThemeContext>
    )
}