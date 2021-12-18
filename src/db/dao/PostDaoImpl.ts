import { nth } from "lodash";
import { Postgres } from "db/pg";
import { Service } from "typedi";
import { Post } from "./entities/Post";
import { PostDao } from "./interfaces/PostDao";

@Service()
export class PostDaoImpl implements PostDao {
  constructor(private readonly db: Postgres) {}

  public async deletePostById(id: string): Promise<void> {
    await this.db.query("DELETE FROM posts WHERE id = $1;", [id]);
  }

  public async getPostById(id: string): Promise<Partial<Post>> {
    const result = await this.db.query(
      `
        SELECT
            p.*,
            TO_JSON(u) as user,
            (
              SELECT COUNT(id) FROM upvotes
              WHERE upvotes.post_id = $1
            )::INT as upvotes

        FROM posts p

        INNER JOIN (
            SELECT id, username, first_name, last_name
            FROM users
        ) u ON p.user_id = u.id
        `,
      [id]
    );

    return nth(result.rows, 0);
  }
}
