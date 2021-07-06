import { DatabaseConnectionType, sql } from "slonik";

export const createCommentsTable = async (
  connection: DatabaseConnectionType
) => {
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS comments (
      id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      body        TEXT NOT NULL,
      user_id     UUID NOT NULL REFERENCES users(id),
      likes       INT  NOT NULL DEFAULT 0,
      post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
