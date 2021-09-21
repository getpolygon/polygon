import pg from "../../db/pg";

export default async <T>(query: string, values: any[]) => {
  const { rows } = (await pg.query(query, values)) as { rows: T[] };
  return rows.at(0);
};
