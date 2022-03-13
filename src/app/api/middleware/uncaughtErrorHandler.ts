import { logger } from "@container";
import { ErrorRequestHandler } from "express";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

export const uncaughtErrorHandler = () => {
  const closure: ErrorRequestHandler = (err, _, res) => {
    logger.warn("unhandled error warning: ", err);

    return new APIErrorResponse(res, {
      data: { error: "Unhandled API error" },
    });
  };

  return closure;
};
