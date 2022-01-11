import { isNil } from "lodash";
import { postDao } from "@container";
import type { Request, Response } from "express";

// For removing a post
const remove = async (req: Request, res: Response) => {
  // Get the post id from the request
  const { id } = req.params;

  // Find the post.
  const post = await postDao.getPostById(id, req.user?.id!);

  // Checking if post exists. This includes checking if post's author
  // is the same as the user making the request.
  if (!isNil(post)) {
    if ((post.user?.id || post.user_id) === req.user?.id) {
      // Delete the post
      await postDao.deletePostById(id);
      return res.sendStatus(204);
    }

    // The user is not the author of the post
    return res.sendStatus(403);
  }

  // The post doesn't exist
  return res.sendStatus(404);
};

export default remove;
