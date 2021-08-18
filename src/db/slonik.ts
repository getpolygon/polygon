import { createPool } from "slonik";
export default createPool(process.env.DATABASE_URL!!);
