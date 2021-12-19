import { upvoteDao } from "container";
import type { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id: postId } = req.params;

  try {
    const upvote = await upvoteDao.createUpvote(postId, userId!);
    return res.json(upvote);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default create;
