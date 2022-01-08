import { nth } from "lodash";
import { Service } from "typedi";
import { Postgres } from "db/pg";
import { Logger } from "util/logger";
import type { Upvote } from "./entities/Upvote";
import { UpvoteDao } from "./interfaces/UpvoteDao";
import { DuplicateRecordException } from "./errors/DuplicateRecordException";

@Service()
export class UpvoteDaoImpl implements UpvoteDao {
  constructor(private readonly db: Postgres, private readonly logger: Logger) {}

  public async createUpvote(
    postId: string,
    userId: string
  ): Promise<Partial<Upvote>> {
    try {
      const result = await this.db.query(
        "INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2) RETURNING created_at;",
        [postId, userId]
      );

      return nth(result.rows, 0);
    } catch (error: any) {
      if (error.code === "23505") throw new DuplicateRecordException(error);
      else {
        this.logger.error("Unhandled error at dao/UpvoteDaoImpl.ts:26");
        this.logger.error(error.message);
        throw error;
      }
    }
  }

  public async deleteUpvote(postId: string, userId: string): Promise<void> {
    await this.db.query(
      "DELETE FROM upvotes WHERE post_id = $1 AND user_id = $2;",
      [postId, userId]
    );
  }
}
