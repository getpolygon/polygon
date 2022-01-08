import { Postgres } from "db/pg";
import { Service } from "typedi";
import { Logger } from "util/logger";
import { User } from "./entities/User";
import { UserDao } from "./interfaces/UserDao";
import { DuplicateRecordException } from "./errors/DuplicateRecordException";

@Service()
export class UserDaoImpl implements UserDao {
  constructor(private readonly db: Postgres, private readonly logger: Logger) {}

  public async getUserByEmail(email: string): Promise<Partial<User> | null> {
    const { rows } = await this.db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    const user = await this.getUserById(rows[0]?.id);
    return user;
  }

  public async deleteUserById(id: string): Promise<void> {
    await this.db.query("DELETE FROM users WHERE id = $1;", [id]);
  }

  public async createUser(user: User): Promise<Partial<User> | null> {
    try {
      const { rows } = await this.db.query(
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

      return rows[0];
    } catch (error: any) {
      if (error?.code === "23505") throw new DuplicateRecordException(error);
      else {
        this.logger.error((error as Error).message);
        throw error;
      }
    }
  }

  public async getUserById(id: string): Promise<Partial<User> | null> {
    const { rows } = await this.db.query(
      "SELECT id, bio, username, last_name, first_name, created_at FROM users WHERE id = $1;",
      [id]
    );

    return rows[0];
  }

  // prettier-ignore
  public async getUserByUsername(username: string): Promise<Partial<User> | null> {
    const { rows } = await this.db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    const user = await this.getUserById(rows[0]?.id);
    return user;
  }
}
