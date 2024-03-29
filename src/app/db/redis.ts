import config from "@config";
import { logger } from "@container";
import { createClient } from "redis";

const redis = createClient({ url: config.databases.redis });

logger.debug("Connecting to Redis...");
redis
  .connect()
  .then(() => logger.info("Connection to Redis established successfully"))
  .catch((e) => {
    logger.error("Error while connecting to Redis");
    throw e;
  });

export default redis as RedisClient;
export type RedisClient = typeof redis;
