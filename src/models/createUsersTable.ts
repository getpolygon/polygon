import { DatabaseConnectionType, sql } from "slonik";

export const createUsersTable = async (connection: DatabaseConnectionType) => {
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS users (
      avatar VARCHAR NOT NULL,
      password VARCHAR NOT NULL,
      last_name VARCHAR NOT NULL,
      first_name VARCHAR NOT NULL,
      bio TEXT DEFAULT '' NOT NULL,
      email VARCHAR NOT NULL UNIQUE,
      username VARCHAR NOT NULL UNIQUE,
      private BOOLEAN NOT NULL DEFAULT false,
      id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
