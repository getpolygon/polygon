import pg from "../../../db/pg";
import { Request, Response } from "express";
import checkStatus from "../../../util/checkStatus";

// For post discovery
const posts = async (req: Request, res: Response) => {
  // Getting next page cursor and post limit per page
  let { cursor, limit = 2 } = req.query;

  // Not letting more than 10 posts per page
  if (limit > 10) limit = 2;

  try {
    if (!cursor) {
      const { rows: posts } = await pg.query(`
        SELECT
          post.id,
          post.title,
          post.content,
          post.created_at,
          TO_JSON(author) as user
        FROM posts Post

        INNER JOIN (
          SELECT
            id,
            avatar,
            username,
            last_name,
            first_name,
            created_at
          FROM users
        ) author ON post.user_id = author.id
        
        ORDER BY post.created_at DESC LIMIT 2;
      `);

      // Filtering out posts from blocked users
      for (const post of posts) {
        // Checking relationship status
        const status = await checkStatus({
          current: req.user?.id!!,
          other: post?.user?.id!! as string,
        });

        // If either of the sides has blocked one or another, remove the post from the array
        if (status === "BLOCKED") posts.filter((p) => p.id !== post.id);
      }

      return res.json({
        data: posts,
        next: posts[posts.length - 1]?.id || null,
      });
    } else {
      const {
        rows: { 0: cursorPost },
      } = (await pg.query("SELECT id, created_at FROM posts WHERE id = $1", [
        cursor,
      ])) as { rows: { created_at: Date; id: string }[] };

      const { rows: posts } = await pg.query(
        `
        SELECT
          post.id,
          post.title,
          post.content,
          post.created_at,
          TO_JSON(author) as user
        FROM posts post

        INNER JOIN (
          SELECT
            id,
            avatar,
            username,
            last_name,
            first_name,
            created_at
          FROM users
        ) author ON post.user_id = author.id
        
        WHERE post.created_at < $1 OR (post.created_at = $1 AND post.id < $2)
        ORDER BY post.created_at DESC, post.id DESC LIMIT 2;
      `,
        [cursorPost?.created_at!!, cursorPost?.id]
      );

      // Filtering out posts from blocked users
      for (const post of posts) {
        // Checking relationship status
        const status = await checkStatus({
          current: req.user?.id!!,
          other: post?.user?.id!! as string,
        });

        // If either of the sides has blocked one or another, remove the post from the array
        if (status === "BLOCKED") posts.filter((p) => p.id !== post.id);
      }

      return res.json({
        data: posts,
        next: posts[posts.length - 1]?.id || null,
      });
    }
  } catch (error: any) {
    // Invalid cursor ID
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};
export default posts;
