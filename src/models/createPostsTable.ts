import { DatabaseConnectionType, sql } from "slonik";

export const createPostsTable = async (connection: DatabaseConnectionType) => {
  // CREATE TYPE POST_PRIVACY_TYPE AS ENUM('PUBLIC', 'PRIVATE');
  
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS posts (
      body        TEXT NOT NULL,
      user_id     UUID NOT NULL REFERENCES users(id),
      privacy     POST_PRIVACY_TYPE NOT NULL DEFAULT E'PUBLIC',
      id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
