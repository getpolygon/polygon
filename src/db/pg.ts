import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!!;
// prettier-ignore
const pg = new Pool({ connectionString });

export default pg;
