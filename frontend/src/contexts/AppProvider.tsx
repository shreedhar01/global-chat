import React from "react";
import { ThemeContext } from "./ThemeContext";
import { AuthContext } from "./AuthContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeContext>
            <AuthContext>
                {children}
            </AuthContext>
        </ThemeContext>
    )
}