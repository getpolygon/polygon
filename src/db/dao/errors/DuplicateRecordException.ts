import type { DatabaseError } from "pg";

export class DuplicateRecordException extends Error {
  constructor(error: DatabaseError) {
    super(
      `
      Duplicate key value violates UNIQUE constraint "${error?.constraint}".
      Error: ${error}
      `
    );
  }
}
