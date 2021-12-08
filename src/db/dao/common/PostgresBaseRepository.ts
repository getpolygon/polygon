import pg from "db/pg";
import { isEmpty, isEqual } from "lodash";
import getFirst from "util/sql/getFirst";
import { IRead } from "dao/interfaces/IRead";
import { KeyValuePair } from "./KeyValuePair";
import { IWrite } from "dao/interfaces/IWrite";
import { normalizeColumns } from "util/sql/normalizeColumns";
// prettier-ignore
import { prepareSetStatement, prepareValuesStatement } from "util/sql/prepareStatement";

/**
 * A class for implementing DAOs for database entities
 */
export abstract class PostgresBaseRepository<T> implements IWrite<T>, IRead<T> {
  constructor(
    /**
     * The table name for the entity
     */
    public readonly tableName: string
  ) {}

  // prettier-ignore
  public async create(columns: Array<keyof T>, values: any[], returning: Array<keyof T | string> = ["*"]): Promise<T> {
    if (!isEqual(columns.length, values.length)) {
      throw new Error(
        "`columns` and `values` cannot have different array sizes"
      );
    } else if (isEmpty(columns) || isEmpty(values) || isEmpty(returning)) {
      throw new Error(
        "`columns` and `values` should not have an array size of `0`"
      )
    }

    const command = `
      INSERT INTO ${this.tableName} (${columns}) 
      VALUES (${prepareValuesStatement(columns.length)})
      RETURNING ${returning}
    `;

    const item = await getFirst<T>(command, values);
    return item;
  }

  // prettier-ignore
  public async update(pair: KeyValuePair<T>, columns: Array<keyof T>, values: any[], returning: Array<keyof T | string>): Promise<T> {
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
      RETURNING ${returning}
    `;

    const item = await getFirst<T>(command, [...values, pair.value]);
    return item;
  }

  public async remove({ key, value }: KeyValuePair<T>): Promise<boolean> {
    await pg.query(`DELETE FROM ${this.tableName} WHERE ${key} = $1`, [value]);
    return true;
  }

  // prettier-ignore
  public async findOne({ key, value }: KeyValuePair<T>, columns: Array<keyof T | string>): Promise<T> {
    const __cols = normalizeColumns<T>(columns);
    // Preparing the command
    const command = `SELECT ${__cols} FROM ${this.tableName} WHERE ${key} = $1`;

    const item = await getFirst<T>(command, [value]);
    return item;
  }
}
