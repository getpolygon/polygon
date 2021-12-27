import pg from "db/pg";
import { Request, Response } from "express";

// For post discovery
const posts = async (req: Request, res: Response) => {
  const { limit } = req.query;
  const currentUserId = req.user?.id;

  /**
   * Querying all posts, including their upvote count,
   * comment count, authors, not including the posts which
   * user has blocked current user or the opposite and including
   * a boolean to indicate whether current user has upvoted the post or not.
   * Sorting by upvote count, comment count and creation date.
   */
  const result = await pg.query(
    `
    SELECT
        p.id,
        p.title,
        p.content,
        p.created_at,
        TO_JSON(a) AS USER,
        (
            SELECT COUNT(post_id) FROM upvotes u
            WHERE u.post_id = p.id
        )::INT AS upvotes,
        (
            SELECT COUNT(post_id) FROM comments c
            WHERE c.post_id = p.id
        )::INT AS COMMENTS,
        (
        SELECT
            CASE
                WHEN EXISTS (
                SELECT
                    1
                FROM
                    upvotes u
                WHERE
                    u.user_id = $1
                    AND 
            u.post_id = p.id
        ) THEN TRUE
                ELSE FALSE
            END
        )::BOOL AS upvoted
                
    FROM posts p

    INNER JOIN (
        SELECT
        id,
        username,
        last_name,
        first_name,
        created_at
        FROM users
    ) a ON p.user_id = a.id

    WHERE (
    SELECT
        CASE
            WHEN EXISTS (
            SELECT
                1
            FROM
                relations r
            WHERE
                (r.to_user = a.id AND r.from_user = $1)
                OR 
                (r.to_user = $1 AND r.from_user = a.id)
                AND r.status <> 'BLOCKED' 
        ) THEN FALSE
            ELSE TRUE
        END
    )

    ORDER BY upvotes, comments, p.created_at DESC LIMIT $2;
    `,
    [currentUserId, limit]
  );

  return res.json(result.rows);
};

export default posts;
