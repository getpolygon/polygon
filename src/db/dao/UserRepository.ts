import { User } from "./entities/User";
import { PostgresBaseRepository } from "./common/PostgresBaseRepository";

export class UserRepository extends PostgresBaseRepository<User> {
  constructor() {
    super("users");
  }
}
