import { logger, upvoteDao } from "container";
import type { Request, Response } from "express";

const remove = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: postId } = req.params;

  try {
    await upvoteDao.deleteUpvote(postId, userId!);
    return res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
};

export default remove;
