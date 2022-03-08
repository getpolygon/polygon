import { Response } from "express";
import { APIResponse, IAPIResponseProps } from "@app/api/common/APIResponse";

export interface IAPIAuthResponseProps {
  expiresIn?: number;
  tokenType?: string;
  accessToken: string;
  refreshToken: string;
}

export class APIAuthResponse<
  T extends IAPIAuthResponseProps
> extends APIResponse<T> {
  constructor(res: Response, payload: IAPIResponseProps<T>) {
    if (!payload.data.tokenType) payload.data.tokenType = "Bearer";
    if (!payload.data.expiresIn) payload.data.expiresIn = 172800000;

    super(res, payload);
  }
}
