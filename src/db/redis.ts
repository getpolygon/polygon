import redis from "redis";
const connectionString = process.env.REDIS_URL;
export default redis.createClient(connectionString!!);
