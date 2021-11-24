import { isEmpty } from "lodash";

/**
 * Utility method for normalizing specified columns in a SQL query
 *
 * @example
 *
 * ```js
 * const cols: string[] = ["id", "name", "surname"];
 * // Will be transformed to
 * "id, name, surname"
 * ```
 *
 * ```sql
 * -- In an SQL query
 * SELECT id, name, surname FROM table
 * ```
 *
 * @example
 * ```js
 * const cols: string[] = [];
 * // Will be transformed to
 * "*"
 * ```
 *
 * ```sql
 * -- In an SQL query
 * SELECT * FROM table;
 * ```
 */
export const normalizeColumns = <T>(cols: Array<keyof T>): string => {
  return `${isEmpty(cols) ? "*" : cols}`;
};
