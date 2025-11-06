import { createServer } from 'node:http';
import { Server,Socket } from 'socket.io';
import { connectDB } from "./config/db.js"
import app from './express.js';
import cookie from "cookie"
import { jwtVerify } from './utils/jwt.js';
import type mongoose from 'mongoose';
import { socketHandler } from './socket/socket.js';

export interface CustomSocket extends Socket {
  userId?: mongoose.Types.ObjectId;
}

connectDB()
    .then(() => {
        const port = process.env.PORT ?? 3000

        const server = createServer(app)
        const io = new Server(server, {
            cors: { origin: "*" }
        })

        io.use(async (socket:CustomSocket, next) => {
            const cookiesHeader = socket.handshake.headers.cookie || "";
            // console.log("reach here 1",cookiesHeader)
            const cookies = await cookie.parse(cookiesHeader)
            // console.log("reach here 2",JSON.stringify(cookies))
            const token = cookies.access_token
            if (!token) return next(new Error("No token provided"));

            try {
                const decoded = await jwtVerify(token);
                socket.userId = decoded._id;
                next();
            } catch (err) {
                next(new Error("Authentication failed"));
            }
        })

        socketHandler(io)

        server.listen(port, () => {
            console.log("Server start at :: ", port)
        })
        server.on("error", (error) => {
            console.log("Error on server :: ", error)
        })
    }).catch((error) => {
        console.log("Error while connecting to DB :: ", error)
    })