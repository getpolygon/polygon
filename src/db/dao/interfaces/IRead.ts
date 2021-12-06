import { KeyValuePair } from "dao/common/KeyValuePair";

export interface IRead<T> {
  /**
   * For getting one record
   *
   * @param pair The keypair to identify the entity that needs to be removed
   * @param columns The columns to include in the result
   */

  findOne(pair: KeyValuePair<T>, columns: Array<keyof T>): Promise<T>;
}
