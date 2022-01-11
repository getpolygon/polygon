export interface ISqlUtil {
  /**
   * For getting the first row from a table.
   *
   * @param query - SQL query
   * @param args - Values for the prepared statement
   */
  getFirst<T>(query: string, args?: unknown[]): Promise<T>;
}
