import { DatabaseConnectionType, sql } from "slonik";

export const createPostsTable = async (connection: DatabaseConnectionType) => {  
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS posts (
      body        TEXT NOT NULL,
      user_id     UUID NOT NULL REFERENCES users(id),
      created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      privacy     VARCHAR NOT NULL CHECK (privacy IN ('PUBLIC', 'PRIVATE')) DEFAULT 'PUBLIC'
    );
  `);
};
