import { nth } from "lodash";
import { Service } from "typedi";
import { Postgres } from "db/pg";
import { Upvote } from "./entities/Upvote";
import { UpvoteDao } from "./interfaces/UpvoteDao";

@Service()
export class UpvoteDaoImpl implements UpvoteDao {
  constructor(private readonly db: Postgres) {}

  // prettier-ignore
  public async createUpvote(postId: string, userId: string): Promise<Partial<Upvote>> {
    const result = await this.db.query(
      "INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2) RETURNING *",
      [postId, userId]
    );

    return nth(result.rows, 0);
  }

  public async deleteUpvote(postId: string, userId: string): Promise<void> {
    await this.db.query(
      "DELETE FROM upvotes WHERE post_id = $1 AND user_id = $2;",
      [postId, userId]
    );
  }
}
