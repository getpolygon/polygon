export class DuplicateRecordException extends Error {
  constructor(error: any) {
    super(
      `
      Duplicate key value violates UNIQUE constraint "${error?.constraint}".
      Error: ${error}
      `
    );
  }
}
