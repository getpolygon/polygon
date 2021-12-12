import { Pool } from "pg";
import config from "config/index";
import { postgres } from "config/env";

const connectionString = postgres || config.databases?.postgres;
const pg = new Pool({ connectionString });

// Connecting to postgres
pg.connect();

export default pg;
