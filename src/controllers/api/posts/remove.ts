import { postDao } from "container";
import { isEqual, isNil } from "lodash";
import type { Request, Response } from "express";

// For removing a post
const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await postDao.getPostById(id);

    // Checking if post exists
    if (!isNil(post)) {
      // Checking whether the author is the same as the current user
      if (isEqual(post.user?.id || post.user_id, req.user?.id)) {
        await postDao.deletePostById(id);
        return res.sendStatus(204);
      }

      return res.sendStatus(403);
    }

    return res.sendStatus(404);
  } catch (error: any) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default remove;
