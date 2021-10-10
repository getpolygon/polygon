import redis from "redis";

const { REDIS_URL } = process.env;

export default redis.createClient(REDIS_URL!!);
