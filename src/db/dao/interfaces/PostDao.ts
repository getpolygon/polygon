import { Post } from "../entities/Post";

export interface PostDao {
  /**
   * A method for deleting a post with ID
   */
  deletePostById(id: string): Promise<void>;

  /**
   * A method for finding a post with ID
   */
  getPostById(id: string): Promise<Partial<Post>>;
}
