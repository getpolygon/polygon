import getFirst from "util/sql/getFirst";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";
import { isEqual, isNil } from "lodash";

// For fetching one post
const one = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Getting the post
    const post = await getFirst<any>(
      `
      SELECT
        post.id,
        post.title,
        post.content,
        post.created_at,
        TO_JSON(author) AS user,
        (
          SELECT COUNT(*) FROM upvotes
          WHERE upvotes.post_id = post.id
        )::INT AS upvote_count,
        (
          SELECT COUNT(*) FROM comments
          WHERE comments.post_id = post.id
        ):: INT AS comment_count

      FROM posts post

      INNER JOIN (
        SELECT
            id,
            avatar,
            username
            last_name,
            first_name,
            username

        FROM users
      ) author ON post.user_id = author.id

      WHERE post.id = $1
      GROUP BY post.id, author.*
      ORDER BY post.created_at DESC;
      `,
      [id]
    );

    // Fetching the relation status between users
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    // If the post does not exist
    if (isNil(post)) return res.sendStatus(404);
    // If post author has blocked current user
    if (isEqual(status, "BLOCKED")) return res.sendStatus(403);

    return res.json(post);
  } catch (error: any) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default one;
