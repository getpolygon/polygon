import { DatabaseConnectionType, sql } from "slonik";

export const createRelationsTable = async (connection: DatabaseConnectionType) => {
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS relations (
      to_user       UUID NOT NULL REFERENCES users(id),
      from_user     UUID NOT NULL REFERENCES users(id),
      created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      id            UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      status        VARCHAR NOT NULL CHECK (status IN ('PENDING', 'FOLLOWING', 'BLOCKED')) DEFAULT 'PUBLIC'
    );
  `);
};
