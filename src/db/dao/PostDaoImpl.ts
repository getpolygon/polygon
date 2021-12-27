import { nth } from "lodash";
import { Postgres } from "db/pg";
import { Service } from "typedi";
import { Post } from "./entities/Post";
import { PostDao } from "./interfaces/PostDao";
@Service()
export class PostDaoImpl implements PostDao {
  constructor(private readonly db: Postgres) {}

  public async createPost(post: Post): Promise<Partial<Post>> {
    // prettier-ignore
    const { rows: { 0: createdPost } } = await this.db.query(
      `
      INSERT INTO posts (title, content, user_id)
      VALUES ($1, $2, $3) RETURNING id;
      `,
      [post.title, post.content, post.user_id]
    );

    // Query for the full post
    const result = await this.db.query(
      `
      SELECT
        p.id,
        p.title,
        p.content,
        p.created_at,
        TO_JSON(a) AS user,
        (
          SELECT COUNT(*) FROM upvotes u
          WHERE u.post_id = p.id
        )::INT as upvotes,
        (
          SELECT COUNT(*) FROM comments c
          WHERE c.post_id = p.id
        )::INT as comments,
        (
          SELECT CASE WHEN EXISTS (
            SELECT 1 FROM upvotes u
            WHERE u.user_id = $2 AND u.post_id = p.id
          ) THEN TRUE ELSE FALSE END
          SELECT TRUE
        )::BOOL as upvoted

      FROM posts p

      INNER JOIN (
        SELECT
          id,
          username,
          last_name,
          first_name

        FROM users
      ) a ON a.id = p.user_id

      WHERE p.id = $1
      ORDER BY p.created_at DESC;
      `,
      [createdPost.id, post.user_id]
    );

    return nth(result.rows, 0);
  }

  public async deletePostById(id: string): Promise<void> {
    await this.db.query("DELETE FROM posts WHERE id = $1;", [id]);
  }

  public async getPostById(
    id: string,
    currentUserId: string
  ): Promise<Partial<Post>> {
    const result = await this.db.query(
      `
        SELECT
            p.*,
            TO_JSON(a) as user,
            (
              SELECT COUNT(post_id) FROM upvotes
              WHERE upvotes.post_id = $1
            )::INT as upvotes,
            (
              SELECT COUNT(post_id) FROM comments
              WHERE comments.post_id = $1
            )::INT as comments,
            (
              SELECT CASE WHEN EXISTS (
                SELECT 1 FROM upvotes u
                WHERE u.user_id = $2 AND u.post_id = p.id
              ) THEN TRUE ELSE FALSE END
            )::BOOL as upvoted

        FROM posts p

        INNER JOIN (
            SELECT id, username, first_name, last_name
            FROM users
        ) a ON p.user_id = a.id

        WHERE p.id = $1 AND (
          SELECT CASE WHEN EXISTS (
            SELECT 1 FROM relations r
            WHERE 
              (r.to_user = $2 AND r.from_user = p.user_id)
              OR
              (r.from_user = $2 AND r.to_user = p.user_id)
              AND
              r.status <> 'BLOCKED'
          ) THEN FALSE
              ELSE TRUE 
          END
        )

        ORDER BY upvotes, comments, p.created_at DESC;
        `,
      [id, currentUserId]
    );

    return nth(result.rows, 0);
  }
}
