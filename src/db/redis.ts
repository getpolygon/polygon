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

const redis = createClient({ url: connectionUrl });
redis.connect().catch(logger.error);

export default redis;

export type RedisClient = typeof redis;
