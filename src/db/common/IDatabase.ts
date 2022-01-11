import { ISqlUtil } from "./ISQLUtil";
import { IDatabaseResult } from "./IDatabaseResult";

export interface IDatabase extends ISqlUtil {
  /**
   * A method for initiating a connection with a database
   */
  connect(): Promise<void>;

  /**
   * For executing prepared statements with arguments
   */
  query(statement: string, args?: unknown[]): Promise<IDatabaseResult>;
}
