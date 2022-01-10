import { logger, upvoteDao } from "container";
import type { Request, Response } from "express";

/**
 * This endpoint is used for removing an upvote
 * from a post. The endpoint always returns `204`
 * as a response without the guarantee that the
 * post or the upvote exists.
 */
const remove = async (req: Request, res: Response) => {
  await upvoteDao.deleteUpvote(req.params.id, req.user?.id!);
  return res.sendStatus(204);
};

export default remove;
