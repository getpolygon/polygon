import redis from "redis";
const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env;

const client = redis.createClient({
  host: REDIS_HOST,
  auth_pass: REDIS_PASS,
  port: parseInt(REDIS_PORT!!),
});

export default client;
