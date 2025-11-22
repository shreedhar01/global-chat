import { createClient, type RedisClientType } from "redis";

export const loadRedis = async (): Promise<RedisClientType> => {
  try {
    const redis: RedisClientType = createClient({ 
      url: process.env.REDIS_URL || "",
      socket: { reconnectStrategy: false }
    });
  
    redis.on("error", (err) => {
      console.log("Redis error :: ", err);
      process.exit(1)
    });
  
    await redis.connect();
    console.log("Redis connected");
  
    return redis;
  } catch (error) {
    console.log("Error on redis :: ",error)
    process.exit(1)
  }
};
