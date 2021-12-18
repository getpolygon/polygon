import { Post } from "../entities/Post";

export interface PostDao {
  /**
   * For deleting a post with ID
   */
  deletePostById(id: string): Promise<void>;
  /**
   * For finding a post with ID
   */
  getPostById(id: string): Promise<Partial<Post>>;
}
