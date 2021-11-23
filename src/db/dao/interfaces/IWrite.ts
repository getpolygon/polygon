export interface IWrite<T> {
  remove(id: string): Promise<boolean>;
  create(rows: Array<keyof T>, values: string[]): Promise<T>;
  update(id: string, rows: Array<keyof T>, values: string[]): Promise<T>;
}
