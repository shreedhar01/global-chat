import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

const Header = () => {
    const [path, setPath] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
        setPath(location.pathname)
    },[location])
    return (
        <nav className="first">
            <div className="flex justify-between items-center w-full md:w-7xl border-b py-2 md:py-4 ">
                <h1 onClick={()=>navigate("/")} className="text-xl font-bold cursor-pointer">ChatApp</h1>
                <div className="flex gap-2">
                    {path !== "/sign-up" ? <Button onClick={()=>navigate("/sign-up")} size="sm">Sign Up</Button>:null}
                    {path !== "/sign-in" ? <Button onClick={()=>navigate("/sign-in")} size="sm">Sign In</Button> :null}
                </div>
            </div>
        </nav>
    )
}

export default Header
