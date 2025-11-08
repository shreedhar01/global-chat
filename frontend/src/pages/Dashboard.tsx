import ChatArea from "@/components/ChatArea"
import SideBar from "@/components/SideBar"
import { AuthContextProvider } from "@/contexts/AuthContext"
import { useContext } from "react"

export default function Dashboard() {
    const { user } = useContext(AuthContextProvider)
    return (
        <div className="first">
            <div className="flex w-full md:w-7xl h-[90vh]">
                <div className="w-25/100 border">
                    <SideBar />
                </div>
                <div className="border w-full">
                    <ChatArea />
                </div>
            </div>
        </div>
    )
}
