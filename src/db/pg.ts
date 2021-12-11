import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!!;
const pg = new Pool({ connectionString });

export default pg;
