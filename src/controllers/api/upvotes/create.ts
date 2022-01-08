import { logger, upvoteDao } from "container";
import type { Request, Response } from "express";
import { DuplicateRecordException } from "dao/errors/DuplicateRecordException";

const create = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: postId } = req.params;

  try {
    const upvote = await upvoteDao.createUpvote(postId, userId!);
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
