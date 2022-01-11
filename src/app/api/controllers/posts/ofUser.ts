import { postDao } from "@container";
import type { Request, Response } from "express";

// For fetching one user's post
const ofUser = async (req: Request, res: Response) => {
  // Get the username from the request
  const { username } = req.params;

  // Get optional the cursor and the limit from the query.
  // It's guaranteed to be a valid UUID string by `celebrate`
  // middleware.
  const { cursor, limit } = req.query as unknown as {
    limit: number;
    cursor: string;
  };

  // Get the user's posts from the post DAO
  const posts = await postDao.getPostsOfUserByUsername(
    username,
    req.user?.id!,
    { cursor, limit }
  );

  // Send the posts to the client
  return res.json(posts);
};

export default ofUser;
