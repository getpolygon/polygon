import { nth } from "lodash";
import { Postgres } from "db/pg";
import { Service } from "typedi";
import { User } from "./entities/User";
import { UserDao } from "./interfaces/UserDao";

@Service()
export class UserDaoImpl implements UserDao {
  /**
   * Using IoC(Inversion of Control) to inject the database
   * and use it for internal operations. The injected class is Postgres in this case
   */
  constructor(private readonly db: Postgres) {}

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
