import React from "react";
import { ThemeContext } from "./ThemeContext";
import { AuthContext } from "./AuthContext";
import { SocketProvider } from "./SocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeContext>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <AuthContext>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </AuthContext>
            </GoogleOAuthProvider>
        </ThemeContext >
    )
}