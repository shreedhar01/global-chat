import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import React, { useContext, useEffect, useState } from "react"
import { AuthContextProvider } from "@/contexts/AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

const Header = () => {
    const [path, setPath] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const { user,setUser } = useContext(AuthContextProvider)
    useEffect(() => {
        setPath(location.pathname)
    }, [location])

    const handleLogOut = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,{},{withCredentials:true})
            toast.success(res.data.message)
            setUser(null)
            navigate("/sign-up")
        } catch (error: any) {
            console.error("Error:", error);
            const msg = error.response?.data?.message || "Something went wrong. Try again.";
            toast.error(msg);
        }
    }
    return (
        <nav className="first bg-white dark:bg-background">
            <div className="flex justify-between items-center w-full md:w-7xl border-b py-2 md:py-4 ">
                <h1 onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer">ChatApp</h1>
                <div className="flex gap-2">
                    {!user && path !== "/sign-up" ? <Button onClick={() => navigate("/sign-up")} size="sm">Sign Up</Button> : null}
                    {!user && path !== "/sign-in" ? <Button onClick={() => navigate("/sign-in")} size="sm">Sign In</Button> : null}
                    {user ? <Button onClick={handleLogOut} size="sm">Log Out</Button> : null}
                </div>
            </div>
        </nav>
    )
}

export default Header
