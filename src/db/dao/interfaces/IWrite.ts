import { KeyValuePair } from "../common/KeyValuePair";

export interface IWrite<T> {
  /**
   * For removing records
   *
   * @param pair The keypair to identify the entity that needs to be removed
   */
  remove(pair: KeyValuePair<T>): Promise<boolean>;

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
  create(columns: Array<keyof T>, values: any[]): Promise<T>;

  /**
   * For updating records
   *
   * @param pair The keypair to identify the entity that needs to be removed
   * @param columns The columns that need to be updated
   * @param values The list of updated values ordered according to the order of `columns`
   *
   * @example
   * ```
   * const repository = new Repository();
   * const updatedItem = repository.update(
   *    {
   *      key: "id",
   *      value: "a17285c2-846e-4592-b444-82a2ad3a6126"
   *    },
   *    ["first_name", "last_name"],
   *    ["Jane", "Doe"]
   * );
   * ```
   */
  update(
    pair: KeyValuePair<T>,
    columns: Array<keyof T>,
    values: any[]
  ): Promise<T>;
}
