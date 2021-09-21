import { Pool } from "pg";

const { DATABASE_URL } = process.env;

const pg = new Pool({
  connectionString: DATABASE_URL!!,
});

export default pg;
