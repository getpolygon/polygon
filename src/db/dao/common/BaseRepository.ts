import pg from "../../pg";
import { isEqual } from "lodash";
import { Entity } from "./Entity";
import { IRead } from "../interfaces/IRead";
import { IWrite } from "../interfaces/IWrite";
import getFirst from "../../../util/getFirst";
import { normalizeColumns } from "../../../util/sql/normalizeColumns";
import { prepareSetStatement } from "../../../util/sql/prepareSetStatement";

/**
 * A class for implementing DAOs for database entities
 */
export abstract class BaseRepository<T extends Entity>
  implements IWrite<T>, IRead<T>
{
  constructor(
    /**
     * The table name for the entity
     */
    public readonly tableName: string
  ) {}

  /**
   * For creating records
   *
   * @param columns The columns that should receive values
   * @param values The values ordered according to the order of `columns`
   *
   * @example
   * ```js
   * const repository = new Repository();
   * const createdItem = await repository.create(
   *     ["first_name", "last_name"],
   *     ["John", "Doe"]
   * )
   * ```
   */
  public async create(columns: Array<keyof T>, values: any[]): Promise<T> {
    if (!isEqual(columns.length, values.length)) {
      throw new Error(
        "`columns` and `values` cannot have different array sizes"
      );
    }

    throw new Error("Method is not implemented.");
  }

  /**
   * For updating records
   *
   * @param id The ID of the entity that needs to be updated
   * @param columns The columns that need to be updated
   * @param values The list of updated values ordered according to the order of `columns`
   *
   * @example
   * ```
   * const repository = new Repository();
   * const updatedItem = repository.update(
   *    "4bcb535d-2b8a-4035-9b0d-de478ecc71c0",
   *    ["first_name", "last_name"],
   *    ["Jane", "Doe"]
   * );
   * ```
   */
  public async update(
    id: string,
    columns: Array<keyof T>,
    values: any[]
  ): Promise<T> {
    // Calculating the index of ID in the prepared SQL query
    const idIndex = values.length + 1;
    // Preparing a SET SQL statement
    const setStatement = prepareSetStatement(columns as string[]);
    // Preparing the command
    const command = `
      UPDATE ${this.tableName} 
      ${setStatement}
      WHERE id = $${idIndex} 
      RETURNING ${columns}
    `;

    const item = await getFirst<T>(command, [...values, id]);
    return item;
  }

  /**
   * For removing records
   *
   * @param id The ID of the entity to remove
   */
  public async remove(id: string): Promise<boolean> {
    await pg.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    return true;
  }

  /**
   * For getting one record
   *
   * @param id The ID of the entity
   * @param columns The columns to include in the result
   */
  public async findOne(id: string, columns: Array<keyof T>): Promise<T> {
    const __cols = normalizeColumns<T>(columns);
    // Preparing the command
    const command = `SELECT ${__cols} FROM ${this.tableName} WHERE id = $1`;

    const item = await getFirst<T>(command, [id]);
    return item;
  }
}
