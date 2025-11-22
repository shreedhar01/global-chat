import { createServer } from "node:http";
import { loadExpress } from "./loaders/express.loader.js";
import { loadDatabase } from "./loaders/db.loader.js";
import { loadRedis } from "./loaders/redis.loader.js";
import { loadSocket } from "./loaders/socket.loader.js";

import type { Server as HttpServer } from "http";
import type { Application } from "express";
import type { Server as SocketIOServer } from "socket.io";
import type { RedisClientType } from "redis";

export const createApp = async (): Promise<{
  app: Application;
  server: HttpServer;
  io: SocketIOServer;
  redis: RedisClientType;
}> => {
  try {
    await loadDatabase();
    const redis = await loadRedis();
  
    const app = loadExpress();
  
    const server = createServer(app);
    const io = loadSocket(server);
  
    return { app, server, io, redis };
  } catch (error) {
    console.log("Error in app :: ",error)
    throw error;
  }
};
