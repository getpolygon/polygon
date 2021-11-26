import { User } from "./entities/User";
import { BaseRepository } from "./common/BaseRepository";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }
}
