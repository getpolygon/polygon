import { User } from "./entities/User";
import { BaseRepository } from "./common/BaseRepository";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }
}

export default UserRepository;
