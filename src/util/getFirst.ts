import pg from "../db/pg";

export default async <T>(query: string, values: any[] = []) => {
  const result = await pg.query(query, values);
  return result.rows[0] as T;
};
