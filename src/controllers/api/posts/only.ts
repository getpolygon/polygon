import pg from "db/pg";
import { isNil } from "lodash";
import { postDao } from "container";
import type { Request, Response } from "express";

// For fetching one post.
const one = async (req: Request, res: Response) => {
  // Get the post id from the request
  const { id } = req.params;

  // Get one post from post DAO. This includes checking user upvote status,
  // comment count, and including user info. Moreover, it also checks
  // if the user is blocked by the post's author. If the user is blocked,
  // it will return null. If the user is not blocked, it will return the post.
  const post = await postDao.getPostById(id, req.user?.id!);

  // Checking if the post is null
  if (isNil(post)) {
    // Besides from getting the post, we also need to check if the post actually exists
    // since we are getting the post and checking user relationship in the same query
    // in which we might end up with a post that doesn't "exist" but was actually
    // filtered out by the query.
    // prettier-ignore
    const { rows: { 0: { exists } } } = await pg.query("SELECT EXISTS (SELECT 1 FROM posts WHERE id = $1)", [id]);

    // The post exists, but the user doesn't have permission to see it.
    if (exists) return res.sendStatus(403);
    else return res.sendStatus(404);
  }

  // Send the post
  return res.json(post);
};

export default one;
