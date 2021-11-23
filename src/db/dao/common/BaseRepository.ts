import pg from "../../pg";
import { Entity } from "./Entity";
import { isEmpty, isEqual } from "lodash";
import { IRead } from "../interfaces/IRead";
import { IWrite } from "../interfaces/IWrite";
import getFirst from "../../../util/getFirst";

export abstract class BaseRepository<T extends Entity>
  implements IWrite<T>, IRead<T>
{
  constructor(public readonly tableName: string) {}

  private normalizeCols(cols: string[]) {
    return `${isEmpty(cols) ? "*" : cols}`;
  }

  /**
   * For creating records
   */
  public async create(columns: Array<keyof T>, values: string[]): Promise<T> {
    if (!isEqual(columns.length, values.length)) {
      throw new Error("`columns` and `values` cannot have different sizes");
    }

    // TODO: This part is untested
    const item = await getFirst<T>(
      `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${new Array(columns.length).map((_, index) =>
        index < columns.length - 1 ? `$${index},` : `$${index}`
      )}) 
      RETURNING *
      `,
      [...values]
    );

    return item;
  }

  /**
   * For updating records
   */
  // prettier-ignore
  public async update(id: string, columns: Array<keyof T>, values: string[]): Promise<T> {
    throw new Error("Method not implemented.");
  }

  /**
   * For removing records
   */
  public async remove(id: string): Promise<boolean> {
    await pg.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    return true;
  }

  /**
   * For getting one record
   */
  public async findOne(id: string, columns: string[]): Promise<T> {
    const __cols = this.normalizeCols(columns);
    const item = await getFirst<T>(
      `SELECT ${__cols} FROM ${this.tableName} WHERE id = $1`,
      [id]
    );

    return item;
  }
}
