import { nth } from "lodash";
import { Service } from "typedi";
import { Postgres } from "db/pg";
import type { Status } from "./entities/Relation";
import { RelationDao } from "./interfaces/RelationDao";

@Service()
export class RelationDaoImpl implements RelationDao {
  constructor(private readonly db: Postgres) {}

  public async getRelationByUsernames(
    first: string,
    second: string
  ): Promise<Status> {
    const [firstQuery, secondQuery] = await Promise.all([
      await this.db.query("SELECT id FROM users WHERE username = $1", [first]),
      await this.db.query("SELECT id FROM users WHERE username = $1", [second]),
    ]);

    const [firstUserId, secondUserId] = [
      nth(firstQuery.rows, 0)?.id,
      nth(secondQuery.rows, 0)?.id,
    ];

    // Calling an internal method for getting the relation status by user IDs
    return await this.getRelationByUserIds(firstUserId, secondUserId);
  }

  public async getRelationByUserIds(
    first: string,
    second: string
  ): Promise<Status> {
    const result = await this.db.query(
      `
      SELECT
        status
      FROM relations 
      
      WHERE 
        (to_user = $1 AND from_user = $2)
      OR 
        (to_user = $2 AND from_user = $1);
      `,
      [first, second]
    );

    return nth(result.rows, 0)?.status;
  }
}
