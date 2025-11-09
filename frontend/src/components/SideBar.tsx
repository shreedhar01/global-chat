import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { AuthContextProvider } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useSocket } from "@/contexts/SocketContext"

interface IactiveUser {
  username: string
}

export default function SideBar() {
  const [totalUser, setTotalUser] = useState()
  const [activeUser, setActiveUser] = useState<IactiveUser[] | null>(null)
  const { user } = useContext(AuthContextProvider)
  const navigate = useNavigate()
  const {socket} = useSocket()


  useEffect(() => {
    const totalUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user`, { withCredentials: true })
        setTotalUser(res.data.data.allUser)
      } catch (error) {
        console.log("Error :: ", error)
      }
    }

    const activeUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/active`, { withCredentials: true })
        setActiveUser(res.data.data)
      } catch (error) {
        console.log("Error :: ", error)
      }
    }
    totalUserData()
    activeUserData()
  }, [])

  useEffect(() => {
  if (!socket) return;

  const handleUserJoined = (msg: IactiveUser) => {
    console.log("user_joined event:", msg);
    setActiveUser(prev => {
      if (!prev) return [msg];
      // avoid duplicates
      if (prev.some(u => u.username === msg.username)) return prev;
      return [msg, ...prev];
    });
  };

  const handleUserLeft = (msg: IactiveUser) => {
    console.log("user_left event:", msg);
    setActiveUser(prev => {
      if (!prev) return [];
      return prev.filter(user => user.username !== msg.username);
    });
  };

  socket.on("user_joined", handleUserJoined);
  socket.on("user_left", handleUserLeft);

  return () => {
    socket.off("user_joined", handleUserJoined);
    socket.off("user_left", handleUserLeft);
  };
}, [socket]);
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <p className="p-2 md:font-brand-bold">Users :  {totalUser}</p>
        <Separator />
        <p className="p-2">Active</p>
        <ScrollArea className="h-96 border">
          {activeUser?.map((v,i) =>
            <div key={i} className="flex gap-1 md:gap-4 items-center border bg-neutral-200 dark:bg-neutral-700 m-2 rounded-2xl">
              <div className="flex items-center justify-center bg-neutral-500 rounded-full m-2 h-8 w-8">
                <p className="text-white dark:text-black md:font-medium md:text-xl">{v?.username[0]}</p>
              </div>
              <p className="">{v?.username}</p>

            </div>
          )}
        </ScrollArea>
      </div>
      <div
        onClick={() => navigate(`/profile/${user?._id}`)}
        className="flex gap-4 items-center border bg-green-200 dark:bg-green-700 m-2 rounded-2xl"
      >
        <div className="flex items-center justify-center bg-neutral-600 rounded-full m-2 h-8 w-8">
          <p className=" font-medium text-xl">{user?.username[0]}</p>
        </div>
        {user?.username}
      </div>
    </div>
  )
}
