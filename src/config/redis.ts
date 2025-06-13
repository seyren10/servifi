import config from "./dotenv";
import logger from "./winston";
import Redis from "ioredis";

const redis = new Redis(config.redisUrl!, {
  maxRetriesPerRequest: 20,
  enableReadyCheck: true,
});

redis.on("error", (err) => logger.error("Redis client error:", err));
redis.on("connect", async () => {
  const { host, port } = redis.options;
  console.log(`Redis Client is serving on ${host}:${port}`);
});

async function shutdown() {
  await redis.quit();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default redis;
