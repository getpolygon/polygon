import pg from "db/pg";
import { nth } from "lodash";

const getFirst = async <T>(query: string, values: any[] = []) => {
  const result = await pg.query(query, values);
  return nth(result.rows, 1) as T;
};

export default getFirst;
