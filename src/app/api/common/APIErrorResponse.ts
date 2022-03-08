import { Response } from "express";
import { APIResponse, IAPIResponseProps } from "@app/api/common/APIResponse";

interface IAPIErrorResponse {
  message?: string;
}

export class APIErrorResponse<
  T extends IAPIErrorResponse
> extends APIResponse<T> {
  constructor(res: Response, payload: IAPIResponseProps<T>) {
    if (!payload.status) payload.status = 500;
    if (!payload.data.message) payload.data.message = "Internal server error.";
    super(res, payload);
  }
}
