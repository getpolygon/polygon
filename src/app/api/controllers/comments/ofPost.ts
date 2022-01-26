import pg from "@db/pg";
import type { Request, Response } from "express";

// For fetching comments of a post
// TODO: Filter out comments made by blocked users
const ofPost = async (req: Request, res: Response) => {
  // Getting the post from the query
  const { post: postId } = req.params;

  const result = await pg.query(
    `
    SELECT
      c.id,
      c.content,
      c.created_at

    FROM comments c

    INNER JOIN (
      SELECT
        id,
        username,
        last_name,
        first_name,
        created_at
      FROM users
    ) u ON c.user_id = u.id

    WHERE c.post_id = $1;
    `,
    [postId]
  );

  return res.json(result.rows);
};

export default ofPost;
