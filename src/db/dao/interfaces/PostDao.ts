import { Post } from "../entities/Post";

export interface PostDao {
  /**
   * A method for deleting a post with ID
   *
   * @param id - The ID of the post to delete
   */
  deletePostById(id: string): Promise<void>;

  /**
   * A method for creating a post
   *
   * @param post - The post to be created
   */
  createPost(post: Post): Promise<Partial<Post>>;

  /**
   * A method for fetching user's posts
   *
   * @param options - Options for fetching the posts
   * @param options.limit - The limit for pagination
   * @param options.cursor - The cursor for pagination
   * @param userId - The ID of the user to get posts for
   * @param currentUserId - The ID of the user who is currently logged in
   */
  getPostsOfUserByUsername(
    username: string,
    currentUserId: string,
    options: { cursor?: string; limit?: number }
  ): Promise<Partial<Post>[]>;

  /**
   * A method for finding a post with ID
   *
   * @param id - The ID of the post to be found
   * @param currentUserId - The ID of the user who is making the request
   */
  getPostById(id: string, currentUserId: string): Promise<Partial<Post>>;
}
