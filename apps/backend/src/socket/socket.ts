import { type Server } from "socket.io"
import { type CustomSocket } from "../index.js"
import { User } from "../models/user.model.js"
import { Chat } from "../models/chat.model.js"

export const socketHandler = (io:Server)=>{
    io.on("connection",async(socket:CustomSocket)=>{
        const user = await User.findById(socket.userId)
        user!.isOnline = true;

        socket.broadcast.emit("user_joined",{username:user?.username})

        await user?.save()
        
        socket.on("message",async (data)=>{
            // console.log("📩 Incoming socket data:", data);
            const payload = typeof data === "string" ? JSON.parse(data) : data;

            // console.log("Type of data:", typeof payload);
            try {
                const chat  = await Chat.create({
                    sender:socket.userId,
                    message:payload.message
                })

                await io.emit("message",{
                    _id:chat._id,
                    sender:{_id:user?._id,username:user?.username},
                    message:payload?.message,
                    createdAt:chat.createdAt,
                    updatedAt:chat.updatedAt
                })

            } catch (error) {
                console.log("Error while sending message :: ",error)
            }
        })

        socket.on("disconnect",async()=>{
            user!.isOnline = false
            await user?.save()
            socket.broadcast.emit("user_left",{username:user?.username})
        })
    })
}