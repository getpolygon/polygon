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

  private normalizeRows(rows: string[]) {
    return `${isEmpty(rows) ? "*" : rows}`;
  }

  /**
   * For creating records
   */
  public async create(rows: Array<keyof T>, values: string[]): Promise<T> {
    if (!isEqual(rows.length, values.length)) {
      throw new Error("`rows` and `values` cannot have different sizes");
    }

    const item = await getFirst<T>(
      `
      INSERT INTO ${this.tableName} (${rows})
      VALUES (${new Array(rows.length).map((_, index) =>
        index < rows.length - 1 ? `$${index},` : `$${index}`
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
  public async update(id: string, rows: Array<keyof T>, values: string[]): Promise<T> {
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
  public async findOne(id: string, rows: string[]): Promise<T> {
    const __rows = this.normalizeRows(rows);
    const item = await getFirst<T>(
      `SELECT ${__rows} FROM ${this.tableName} WHERE id = $1`,
      [id]
    );

    return item;
  }
}
