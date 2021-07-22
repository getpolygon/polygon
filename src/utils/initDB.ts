import { DatabaseConnectionType, sql } from "slonik";
import { createPostsTable } from "../models/createPostsTable";
import { createUsersTable } from "../models/createUsersTable";
import { createCommentsTable } from "../models/createCommentsTable";
import { createRelationsTable } from "../models/createRelationsTable";

/**
 * Function for initializing the connection
 * to the database and for creating all tables
 */
export default async (connection: DatabaseConnectionType) => {
  try {
    // UUID Support
    await connection.query!!(sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // Creating users table
    await createUsersTable(connection);
    // Creating posts table
    await createPostsTable(connection);
    // Creating comments table
    await createCommentsTable(connection);
    // Creating relationships table
    await createRelationsTable(connection);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
