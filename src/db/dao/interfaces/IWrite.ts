export interface IWrite<T> {
  remove(id: string): Promise<boolean>;
  create(columns: Array<keyof T>, values: string[]): Promise<T>;
  update(id: string, columns: Array<keyof T>, values: string[]): Promise<T>;
}
