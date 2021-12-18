import config from "config";
import { createClient } from "redis";
import { redis as redisEnv } from "config/env";

const connectionUrl = config.databases?.redis || redisEnv;
const redis = createClient({ url: connectionUrl });

// Opening a connection
redis.connect().catch(console.error);

export default redis;

export type RedisClient = typeof redis;
