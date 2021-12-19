import pg from "db/pg";
import { relationDao } from "container";
import { Request, Response } from "express";
import { isNil, gt, filter, nth } from "lodash";

// For post discovery
const posts = async (req: Request, res: Response) => {
  // Getting next page cursor and post limit per page
  // eslint-disable-next-line prefer-const
  let { cursor, limit = 2 } = req.query;

  // Not letting more than 10 posts per page
  if (gt(limit, 10)) limit = 2;

  try {
    if (isNil(cursor)) {
      const { rows: posts } = await pg.query(
        `
        SELECT
          post.id,
          post.title,
          post.content,
          post.created_at,
          TO_JSON(author) as user,
          (
            SELECT COUNT(*) FROM upvotes
            WHERE upvotes.post_id = post.id
          )::INT AS upvote_count,
          (
            SELECT COUNT(*) FROM comments
            WHERE comments.post_id = post.id
          )::INT AS comment_count,
          (
            SELECT CASE WHEN EXISTS (
              SELECT 1 FROM upvotes
              WHERE upvotes.user_id = $1
            ) THEN TRUE ELSE FALSE END
          ) AS upvoted

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
      `,
        [req.user?.id]
      );

      // Filtering out posts from blocked users
      for (const post of posts) {
        // Checking relationship status
        const status = await relationDao.getRelationByUserIds(
          req.user?.id!,
          post?.user?.id
        );
        if (status === "BLOCKED") filter(posts, (p) => p.id !== post.id);
      }

      return res.json({
        data: posts,
        next: nth(posts, -1)?.id || null,
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
          TO_JSON(author) as user,
          (
            SELECT COUNT(*) FROM upvotes
            WHERE upvotes.post_id = post.id
          )::INT AS upvote_count,
          (
            SELECT COUNT(*) FROM comments
            WHERE comments.post_id = post.id
          )::INT AS comment_count,
          (
            SELECT CASE WHEN EXISTS (
              SELECT 1 FROM upvotes
              WHERE upvotes.user_id = $3
            ) THEN TRUE ELSE FALSE END
          ) AS upvoted

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
        [cursorPost?.created_at!, cursorPost?.id, req.user?.id]
      );

      // Filtering out posts from blocked users
      for (const post of posts) {
        // Checking relationship status
        const status = await relationDao.getRelationByUserIds(
          req.user?.id!,
          post?.user?.id
        );
        // If either of the sides has blocked one or another, remove the post from the array
        if (status === "BLOCKED") filter(posts, (p) => p.id !== post.id);
      }

      return res.json({
        data: posts,
        next: nth(posts, -1)?.id || null,
      });
    }
  } catch (error: any) {
    console.error(error);
    return res.sendStatus(500);
  }
};
export default posts;
