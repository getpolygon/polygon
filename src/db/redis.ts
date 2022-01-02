import { isNil } from "lodash";
import config from "config/index";
import { logger } from "container";
import { createClient } from "redis";
import { PartialConfigError } from "lib/PartialConfigError";
import { redis as redisConnectionStringEnv } from "config/env";

const connectionUrl = config.databases?.redis || redisConnectionStringEnv;
if (isNil(connectionUrl)) {
  throw new PartialConfigError("`databases.redis`");
}

const redis = createClient({ url: connectionUrl, legacyMode: true });
// prettier-ignore
redis.connect().then(() => logger.info("Connection to Redis established successfully"))
  .catch((e) => {
    logger.error("There was an error while connecting to Redis");
    throw e;
  });

export default redis;

export type RedisClient = typeof redis;
