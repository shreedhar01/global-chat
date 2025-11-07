import { AuthContextProvider } from "@/contexts/AuthContext"
import { useContext } from "react"

export default function Dashboard() {
    const user = useContext(AuthContextProvider)
    return (
        <div className="first">
            Dashboard :: {JSON.stringify(user)}
        </div>
    )
}
