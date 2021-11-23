export interface IRead<T> {
  findOne(id: string, columns: string[]): Promise<T>;
  // findMany(_: string, columns: string[]): Promise<T[]>;
}
