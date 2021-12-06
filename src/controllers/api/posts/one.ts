import getFirst from "util/sql/getFirst";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";

// For fetching one post
const one = async (req: Request, res: Response) => {
  // The id of the post
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
      current: req.user?.id!!,
      other: post?.user_id!! as string,
    });

    // If post exists
    if (!post) return res.sendStatus(404);

    // If post author has blocked current user
    if (status === "BLOCKED") return res.sendStatus(403);
    return res.json(post);
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default one;
