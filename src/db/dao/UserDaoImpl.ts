import { nth } from "lodash";
import { Postgres } from "db/pg";
import { Service } from "typedi";
import { User } from "./entities/User";
import { UserDao } from "./interfaces/UserDao";
import { DuplicateRecordError } from "./errors/DuplicateRecordError";
import { Logger } from "util/logger";

@Service()
export class UserDaoImpl implements UserDao {
  constructor(private readonly db: Postgres, private readonly logger: Logger) {}

  public async deleteUserById(id: string): Promise<void> {
    await this.db.query("DELETE FROM users WHERE id = $1;", [id]);
  }

  public async createUser(user: User): Promise<Partial<User> | null> {
    try {
      const result = await this.db.query(
        `
        INSERT INTO users (
          email,
          password, 
          username, 
          last_name, 
          first_name 
        ) VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `,
        [
          user.email,
          user.password,
          user.username,
          user.last_name,
          user.first_name,
        ]
      );

      return nth(result.rows, 0);
    } catch (error: any) {
      if (error?.code === "23505") throw new DuplicateRecordError(error);
      else {
        this.logger.error((error as Error).message);
        throw error;
      }
    }
  }

  public async getUserById(id: string): Promise<Partial<User> | null> {
    const result = await this.db.query(
      "SELECT id, bio, username, last_name, first_name, created_at FROM users WHERE id = $1;",
      [id]
    );

    return nth(result.rows, 0);
  }

  // prettier-ignore
  public async getUserByUsername(username: string): Promise<Partial<User> | null> {
    const result = await this.db.query(
      "SELECT id, bio, username, last_name, first_name, created_at FROM users WHERE username = $1;",
      [username]
    );

    return nth(result.rows, 0);
  }
}
