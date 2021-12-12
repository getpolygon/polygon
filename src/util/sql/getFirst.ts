import pg from "db/pg";
import { nth } from "lodash";

/**
 * SQL utility for getting the first row from a table
 *
 * @param query - SQL query
 * @param values - Values for the prepared statement
 */
const getFirst = async <T>(query: string, values: unknown[] = []) => {
  const result = await pg.query(query, values);
  return nth(result.rows, 0) as T;
};

export default getFirst;
