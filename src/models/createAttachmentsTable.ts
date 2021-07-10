import { DatabaseConnectionType, sql } from "slonik";

export const createAttachmentsTable = async (
  connection: DatabaseConnectionType
) => {
  return await connection.query!!(sql`
    CREATE TABLE IF NOT EXISTS attachments (
      id              UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id         UUID NOT NULL REFERENCES posts(id),
      attachment_url  VARCHAR NOT NULL
    );
  `);
};
