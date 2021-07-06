import { DatabaseConnectionType, sql } from "slonik";
const __DEV__ = process.env.NODE_ENV === "development";
import { createPostsTable } from "../models/createPostsTable";
import { createUsersTable } from "../models/createUsersTable";
import { createCommentsTable } from "../models/createCommentsTable";

export default async (connection: DatabaseConnectionType) => {
  try {
    // Enabling UUID extension if not enabled
    await connection.query!!(sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // Creating users table
    await createUsersTable(connection);
    // Creating posts table
    await createPostsTable(connection);
    // Creating comments table
    await createCommentsTable(connection);
  } catch (error) {
    console.error(error);
  }
};
