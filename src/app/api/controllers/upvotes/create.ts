import type { Handler } from "express";
import { upvoteDao } from "@container";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";
import { DuplicateRecordException } from "@dao/errors/DuplicateRecordException";

/**
 * This endpoint will attempt to create an upvote on
 * a post. If an upvote already exists on the specified
 * post, the endpoint will return `409 (Conflict)` as a
 * response, otherwise `200`.
 */
const create: Handler = async (req, res, next) => {
  try {
    const upvote = await upvoteDao.createUpvote(req.params.id, req.user?.id!);
    return new APIResponse(res, { data: upvote });
  } catch (error) {
    if (error instanceof DuplicateRecordException) {
      return new APIErrorResponse(res, {
        status: 409,
        data: { message: "Upvote already exists" },
      });
    } else return next(error);
  }
};

export default create;
