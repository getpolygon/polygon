import pg from "../../pg";
import { isEqual } from "lodash";
import { IRead } from "../interfaces/IRead";
import { IWrite } from "../interfaces/IWrite";
import getFirst from "../../../util/getFirst";
import { KeyValuePair } from "./KeyValuePair";
import { normalizeColumns } from "../../../util/sql/normalizeColumns";
import { prepareSetStatement } from "../../../util/sql/prepareSetStatement";

/**
 * A class for implementing DAOs for database entities
 */
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  constructor(
    /**
     * The table name for the entity
     */
    public readonly tableName: string
  ) {}

  public async create(columns: Array<keyof T>, values: any[]): Promise<T> {
    if (!isEqual(columns.length, values.length)) {
      throw new Error(
        "`columns` and `values` cannot have different array sizes"
      );
    }

    throw new Error("Method is not implemented.");
  }

  // prettier-ignore
  public async update(pair: KeyValuePair<T>, columns: Array<keyof T>, values: any[]): Promise<T> {
    if (!isEqual(columns.length, values.length)) {
      throw new Error(
        "`columns` and `values` cannot have different array sizes"
      );
    }

    // Calculating the index of ID in the prepared SQL query
    const idIndex = values.length + 1;
    // Preparing a SET SQL statement
    const setStatement = prepareSetStatement(columns as string[]);
    // Preparing the command
    const command = `
      UPDATE ${this.tableName} ${setStatement}
      WHERE ${pair.key} = $${idIndex} 
      RETURNING ${columns}
    `;

    const item = await getFirst<T>(command, [...values, pair.value]);
    return item;
  }

  public async remove({ key, value }: KeyValuePair<T>): Promise<boolean> {
    await pg.query(`DELETE FROM ${this.tableName} WHERE ${key} = $1`, [value]);
    return true;
  }

  // prettier-ignore
  public async findOne({ key, value }: KeyValuePair<T>, columns: Array<keyof T>): Promise<T> {
    const __cols = normalizeColumns<T>(columns);
    // Preparing the command
    const command = `SELECT ${__cols} FROM ${this.tableName} WHERE ${key} = $1`;

    const item = await getFirst<T>(command, [value]);
    return item;
  }
}
