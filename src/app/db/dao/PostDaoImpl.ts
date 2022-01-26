import { Postgres } from "@db/pg";
import { Service } from "typedi";
import type { Post } from "./entities/Post";
import { nth, isNil, isEmpty } from "lodash";
import { PostDao } from "./interfaces/PostDao";

@Service()
export class PostDaoImpl implements PostDao {
  constructor(private readonly db: Postgres) {}

  public async getPostsOfUserByUsername(
    username: string,
    currentUserId: string,
    options: { cursor?: string; limit?: number }
  ): Promise<Partial<Post>[]> {
    // Temporary cursor value for pagination. Will be replaced with a real cursor value
    // when pagination is implemented. For now, it's just a placeholder. See below.
    let cursor: Partial<Post> | null = null;

    // If cursor is provided, use it to find the post
    if (!isNil(options.cursor)) {
      // Check if the cursor is valid. If not, we won't assign it to the cursor.
      // This is to prevent the user from providing an invalid cursor.
      // prettier-ignore
      const __cursor = await this.db.getFirst<Partial<Post> | null>(
        `
        SELECT id, created_at FROM posts WHERE id = $1
        ORDER BY created_at DESC
        LIMIT 1;
        `,
        [options.cursor]
      );

      // Assign the cursor if it is valid
      if (!isNil(__cursor) && !isEmpty(__cursor)) cursor = __cursor;
    }

    // SQL query arguments
    const args = [username, currentUserId, options.limit];
    if (!isEmpty(cursor)) args.push(cursor?.id, cursor?.created_at);

    // Get the posts of the user. If cursor is provided, use it to find the posts
    // of the user. If not, use the default limit.
    const result = await this.db.query(
      `
      SELECT
        p.id,
        p.title,
        p.content,
        p.created_at,
        TO_JSON(a) AS user,
        (
          SELECT COUNT(post_id)
          FROM upvotes u
          WHERE u.post_id = p.id
        )::INT AS upvotes,
        (
          SELECT COUNT(post_id) 
          FROM comments c 
          WHERE c.post_id = p.id
        )::INT AS comments,
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

      WHERE a.username = $1
      AND (
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
      ) ${
        !isNil(cursor)
          ? `
            AND (
              p.created_at < $5 OR (p.created_at = $5 AND p.id < $4)
            )
            `
          : ""
      }

      ORDER BY upvotes DESC
      LIMIT $3;
      `,
      args
    );

    // Return the posts
    return result.rows;
  }

  public async createPost(post: Post): Promise<Partial<Post>> {
    // prettier-ignore
    const { rows: { 0: created } } = await this.db.query(
      `
      INSERT INTO posts (title, content, user_id)
      VALUES ($1, $2, $3) RETURNING id;
      `,
      [post.title, post.content, post.user_id]
    );

    return created;
  }

  public async deletePostById(id: string): Promise<void> {
    await this.db.query("DELETE FROM posts WHERE id = $1;", [id]);
  }

  public async getPostById(
    id: string,
    currentUserId: string
  ): Promise<Partial<Post>> {
    // Will get the post, including the user who created it
    // and the number of upvotes and comments. Will also
    // check if current user has upvoted the post. Will filter
    // out the post if the current user is blocked by the user
    // who created it.
    const result = await this.db.query(
      `
        SELECT
            p.id,
            p.title,
            p.content,
            p.created_at,
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
