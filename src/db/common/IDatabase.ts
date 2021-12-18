import { IDatabaseResult } from "./IDatabaseResult";

export interface IDatabase {
  /**
   * A method for initiating a connection with a database
   */
  connect(): Promise<void>;
  /**
   * For executing prepared statements with arguments
   */
  query(statement: string, args?: any[]): Promise<IDatabaseResult>;
}
