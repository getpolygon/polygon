export interface IRead<T> {
  findOne(id: string, rows: string[]): Promise<T>;
  // findMany(_: string, rows: string[]): Promise<T[]>;
}
