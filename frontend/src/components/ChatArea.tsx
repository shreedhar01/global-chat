import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { Textarea } from "./ui/textarea";
import { SendIcon } from "lucide-react"
import { Button } from "./ui/button";
import { useSocket } from "@/contexts/SocketContext";

interface ISender {
  _id: string,
  username: string
}

interface IChat {
  message: string,
  sender: ISender,
  _id: string,
  createdAt: string,
  updatedAt: string
}

export default function ChatArea() {
  const [chat, setChat] = useState<IChat[] | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPage, setTotalPage] = useState<number | null>()
  const { user } = useContext(AuthContextProvider)
  const [message, setMessage] = useState("")
  const { socket } = useSocket()

  const messageEndRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const topAnchorRef = useRef<HTMLDivElement | null>(null)
  // const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const loadInitial = async () => {
      try {
        isLoadingRef.current = true
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chat`, {
          params: { page: 1, limit },
          withCredentials: true,
        })

        const { chat: chatData, page: serverPage, totalPage: serverTotal } = res.data.data
        setChat(chatData)
        setPage(serverPage)
        setTotalPage(serverTotal)
      } catch (error) {
        console.log("Error ::", error)
      } finally {
        isLoadingRef.current = false
      }
    }

    loadInitial()
  }, [limit])

  useEffect(() => {
    if (!socket) return

    const handleIncoming = (msg: IChat) => {
      setChat(prev => prev ? [...prev, msg] : [msg])
    }

    socket.on("message", handleIncoming)
    return () => {
      socket.off("message", handleIncoming)
    }
  }, [socket])

  useEffect(() => {
    if (!scrollAreaRef.current || !messageEndRef.current) return

    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null

    if (!viewport) return

    const nearBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 150

    if (nearBottom) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])

  const handleChatSubmit = async (e: React.FormEvent) => {
    // console.log("i am here")
    e.preventDefault()
    if (!message.trim() || !socket) return
    try {
      await socket?.emit("message", { username: user?.username, message: message.trim() })
      setMessage("")
    } catch (error) {
      console.log("Error :: ", error)
    }
  }

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null

    if (!viewport) return

    const handleScrollLoadMessage = async () => {
      if (
        viewport.scrollTop < 50 &&
        !isLoadingRef.current &&
        totalPage &&
        page < totalPage
      ) {
        isLoadingRef.current = true

        const prevScrollHeight = viewport.scrollHeight

        try {
          const nextPage = page + 1
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chat`, {
            params: { page: nextPage, limit },
            withCredentials: true,
          })

          const olderMessages: IChat[] = res.data.data.chat

          setChat(pre => pre ? [...olderMessages, ...pre] : [...olderMessages])
          setPage(nextPage)

          // Wait for DOM update then restore scroll to avoid jump
          requestAnimationFrame(() => {
            const newScrollHeight = viewport.scrollHeight
            const diff = newScrollHeight - prevScrollHeight
            viewport.scrollTop = viewport.scrollTop + diff
          })
        } catch (error) {
          console.error("Error loading older messages:", error)
        } finally {
          isLoadingRef.current = false
        }
      }
    }

    viewport.addEventListener("scroll", handleScrollLoadMessage)
    return () => viewport.removeEventListener("scroll", handleScrollLoadMessage)
  }, [page, totalPage, limit])


  return (
    <div className="h-full">
      <ScrollArea ref={scrollAreaRef} className="h-[80vh]"
      >
        <div ref={topAnchorRef} />
        <div className="flex flex-col justify-between gap-y-8 w-full ">
          {
            chat?.map(v =>
              <div
                key={v._id}
                className={`flex ${user?.username !== v.sender.username ? "justify-start" : "justify-end"}  `}
              >
                <div className={`flex ${user?.username !== v.sender.username ? "justify-start" : "justify-end"} w-75/100 `}>
                  {user?.username !== v.sender.username ? <div className="flex items-center justify-center bg-neutral-500 rounded-full m-2 h-8 w-8">
                    <p className="text-white dark:text-black md:font-medium md:text-xl">{v.sender.username[0]}</p>
                  </div> : null}
                  <div className="flex flex-col justify-end ">
                    <p className={`${user?.username !== v.sender.username ? "bg-neutral-800" : "bg-neutral-600"} m-2 p-2 rounded-xl w-fit`}>{v.message}</p>
                    <p className={`flex ${user?.username !== v.sender.username ? "justify-start" : "justify-end"} text-xs text-neutral-500`}>{new Date(v.createdAt).toLocaleString()}</p>
                  </div>
                  {user?.username === v.sender.username ? <div className="flex items-center justify-center bg-neutral-500 rounded-full m-2 h-8 w-8">
                    <p className="text-white dark:text-black md:font-medium md:text-xl">{v.sender.username[0]}</p>
                  </div> : null}
                </div>
              </div>
            )
          }
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <form onSubmit={handleChatSubmit} className="h-[10vh] border-t flex justify-between items-center px-4 bg-background">
        <Textarea
          onChange={e => setMessage(e.target.value)}
          className="h-full w-75/100 md:w-90/100 overflow-y-auto"
          placeholder="Type your message..."
          value={message}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line
              handleChatSubmit(e);
            }
          }}
        />
        < Button type="submit" >
          <SendIcon />
        </Button>
      </form>
    </div >
  )
}
