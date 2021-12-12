import config from "config/index";
import { redis } from "config/env";
import { createClient } from "redis";

const connectionUrl = config.databases?.redis || redis;
const client = createClient({ url: connectionUrl });

// Opening a connection
client.connect().catch(console.error);

export default client;
