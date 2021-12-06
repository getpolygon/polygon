import { createClient } from "redis";

const connectionUrl = process.env.REDIS_URL;
// prettier-ignore
const client = createClient({ url: connectionUrl });

export default client;
