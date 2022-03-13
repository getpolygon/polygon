import { Response } from "express";

export interface IAPIResponseProps<T> {
  data: T;
  status?: number;
}

export class APIResponse<T> {
  constructor(res: Response, { status, data }: IAPIResponseProps<T>) {
    return res.status(status ?? 200).json({
      data,
      status,
    });
  }
}
