import { logger, upvoteDao } from "container";
import type { Request, Response } from "express";
import { DuplicateRecordException } from "dao/errors/DuplicateRecordException";

/**
 * This endpoint will attempt to create an upvote on
 * a post. If an upvote already exists on the specified
 * post, the endpoint will return `409 (Conflict)` as a
 * response, otherwise `200`.
 */
const create = async (req: Request, res: Response) => {
  try {
    const upvote = await upvoteDao.createUpvote(req.params.id, req.user?.id!);
    return res.json(upvote);
  } catch (error) {
    if (error instanceof DuplicateRecordException) return res.sendStatus(409);
    else {
      logger.error(error);
      return res.sendStatus(500);
    }
  }
};

export default create;
