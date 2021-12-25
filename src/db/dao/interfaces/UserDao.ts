import { User } from "../entities/User";

export interface UserDao {
  /**
   * A method for create a user
   *
   * @param user - User entity with the required information
   */
  createUser(user: User): Promise<Partial<User> | null>;

  /**
   * Find a user with the given ID
   */
  getUserById(id: string): Promise<Partial<User> | null>;

  /**
   * Find a user with the given username
   */
  getUserByUsername(username: string): Promise<Partial<User> | null>;
}
