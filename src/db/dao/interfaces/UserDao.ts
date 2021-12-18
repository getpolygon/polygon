import { User } from "../entities/User";

export interface UserDao {
  /**
   * Find a user with the given ID
   */
  getUserById(id: string): Promise<Partial<User> | null>;

  /**
   * Find a user with the given username
   */
  getUserByUsername(username: string): Promise<Partial<User> | null>;
}
