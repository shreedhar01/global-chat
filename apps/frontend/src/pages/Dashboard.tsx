import ChatArea from "@/components/ChatArea"
import SideBar from "@/components/SideBar"


export default function Dashboard() {
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
