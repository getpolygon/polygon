import { Upvote } from "../entities/Upvote";

export interface UpvoteDao {
  /**
   * A method for upvoting posts
   * @param postId - Post ID to add the upvote to
   * @param userId - User ID to which the upvote will be associated
   */
  createUpvote(postId: string, userId: string): Promise<Partial<Upvote>>;

  /**
   * A method for removing upvotes from posts
   * @param postId - Post ID to remove the upvote from
   * @param userId - User ID to verify the record
   */
  deleteUpvote(postId: string, userId: string): Promise<void>;
}
