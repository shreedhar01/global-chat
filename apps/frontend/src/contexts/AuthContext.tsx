import axios from "axios"
import React, { createContext, useEffect, useState } from "react"

interface IAuthData {
    _id: string,
    username: string
}

interface IAuthContext {
    user: IAuthData | null,
    loading: boolean,
    setUser: React.Dispatch<React.SetStateAction<IAuthData | null>>
}

export const AuthContextProvider = createContext<IAuthContext>({
    user: null,
    loading:true,
    setUser: () => { }
})

export const AuthContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IAuthData | null>(null);
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/me`, { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(()=> setLoading(false));
    }, []);

    return (
        <AuthContextProvider.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContextProvider.Provider>
    )
}