import { createClient } from "redis";
import { config } from "dotenv";

config();

export const getRedisClient = async () => {
  const pub = createClient({
    url: process.env.REDIS_URI,
  });

  const sub = createClient({
    url: process.env.REDIS_URI,
  });

  pub.on("error", (err) => console.log("Redis Client Error", err));

  await pub.connect();
  await sub.connect();

  return { pub, sub };
};
