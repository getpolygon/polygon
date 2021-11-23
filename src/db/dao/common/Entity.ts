/**
 * Entity class provides utilites for working with Entites
 */
export class Entity {
  /**
   * For getting a class instance as an object
   *
   * @example
   * class Foo {
   *    public readonly bar: string;
   *
   *    constructor(bar: string) {
   *        this.bar = bar;
   *    }
   * }
   *
   * @example
   * {
   *   "bar": "something"
   * }
   */
  asOject(): object {
    return Object.freeze(this);
  }

  /**
   * Will return object keys as a string
   *
   * @example "id, name, surname"
   */
  keysAsString(): string {
    const keys: string[] = [];

    for (const key in this.asOject()) {
      keys.push(key);
    }

    return keys.join(",");
  }
}
