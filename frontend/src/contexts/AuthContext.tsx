import React, { createContext, useState } from "react"

interface IAuthData {
    _id: string,
    username: string
}

interface IAuthContext {
    user: IAuthData | null,
    setUser: React.Dispatch<React.SetStateAction<IAuthData | null>>
}

export const AuthContextProvider = createContext<IAuthContext>({
    user: null,
    setUser: () => { }
})

export const AuthContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IAuthData | null>(null);
    return (
        <AuthContextProvider.Provider value={{ user, setUser }}>
            {children}
        </AuthContextProvider.Provider>
    )
}