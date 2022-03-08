import pg from "@db/pg";
import { postDao } from "@container";
import type { Request, Response } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For fetching one post.
const only = async (req: Request, res: Response) => {
  // Get the post id from the request
  const { id } = req.params;

  // Get one post from post DAO. This includes checking user upvote status,
  // comment count, and including user info. Moreover, it also checks
  // if the user is blocked by the post's author. If the user is blocked,
  // it will return null. If the user is not blocked, it will return the post.
  const post = await postDao.getPostById(id, req.user?.id!);

  // Checking if the post is null
  if (post === null) {
    // Besides from getting the post, we also need to check if the post actually exists
    // since we are getting the post and checking user relationship in the same query
    // in which we might end up with a post that doesn't "exist" but was actually
    // filtered out by the query.
    const exists = await pg.getFirst(
      "SELECT EXISTS (SELECT 1 FROM posts WHERE id = $1)",
      [id]
    );

    if (exists) {
      // The post exists, but the user doesn't have permission to see it.
      return new APIErrorResponse(res, {
        status: 403,
        data: { error: "Forbidden access" },
      });
    } else {
      return new APIErrorResponse(res, {
        status: 404,
        data: { error: "Post does not exist" },
      });
    }
  }

  return new APIResponse(res, { data: post });
};

export default only;
