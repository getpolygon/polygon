export interface IRead<T> {
  findOne(id: string, columns: Array<keyof T>): Promise<T>;
}
