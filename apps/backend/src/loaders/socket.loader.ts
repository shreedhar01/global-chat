import { Server } from "socket.io";
import cookie from "cookie";
import { jwtVerify } from "../services/jwt.js";
import { socketHandler } from "../socket/socket.js";
import  {createServer as typeServer} from "node:http"

export const loadSocket = (server : ReturnType<typeof typeServer>) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookiesHeader = socket.handshake.headers.cookie || "";
    const cookies = cookie.parse(cookiesHeader);

    const token = cookies.access_token;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = await jwtVerify(token);
      socket.userId = decoded._id.toString();
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  socketHandler(io);

  return io;
};
