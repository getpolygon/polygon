const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env;
const redis = require("redis");
const client = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
	auth_pass: REDIS_PASS
});
module.exports = client;
