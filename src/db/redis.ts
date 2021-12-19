import { isNil } from "lodash";
import config from "config/index";
import { createClient } from "redis";
import { redis as redisEnv } from "config/env";
import { PartialConfigError } from "lib/PartialConfigError";

const connectionUrl = config.databases?.redis || redisEnv;
if (isNil(connectionUrl)) {
  throw new PartialConfigError("`databases.redis`");
}

const redis = createClient({ url: connectionUrl });
redis.connect().catch(console.error);

export default redis;
export type RedisClient = typeof redis;
