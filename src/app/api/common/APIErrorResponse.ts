import { Response } from "express";
import { APIResponse, IAPIResponseProps } from "@app/api/common/APIResponse";

interface IAPIErrorResponse {
  error?: string;
}

export class APIErrorResponse<
  T extends IAPIErrorResponse
> extends APIResponse<T> {
  constructor(res: Response, payload: IAPIResponseProps<T>) {
    if (!payload.status) payload.status = 500;
    if (!payload.data.error) payload.data.error = "Internal server error.";
    super(res, payload);
  }
}
