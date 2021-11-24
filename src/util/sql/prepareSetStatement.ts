import { map, join } from "lodash";

/**
 * A function for preparing **`SET`** statements
 *
 * @param columns The columns that need to be updated
 *
 * @example
 * ```js
 * const prepared = prepareSetStatement(["id", "name"]);
 * ```
 *
 * Will return a prepared SQL string to use with `pg`
 *
 * ```sql
 * SET id = $1, name = $2;
 * ```
 */
export const prepareSetStatement = <T>(columns: Array<keyof T>): string => {
  const generated: string[] = [`SET`];

  // Mapping all the columns
  map(columns, (column, index) => {
    // Adding a colon if another column exists
    const colon = `${index < columns.length - 1 ? "," : ""}`;
    const command = `${column} = $${index + 1}`;
    const query = `${command}${colon}`;

    generated.push(query);
  });

  // Merging it all to a string
  return join(generated, " ");
};
