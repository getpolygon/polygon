import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";
import { Comment, Post } from "../../types";
import { checkStatus } from "../../helpers/helpers";

// For creating a comment
export const create = async (req: Express.Request, res: Express.Response) => {
  // Post content
  const { body } = req.body;
  // The id of the post
  const { post: postId } = req.params;

  // Get the post
  const post = await slonik.maybeOne(sql<Partial<Post>>`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  // If post exists
  if (post) {
    // Checking if the other user has blocked current user
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    // Not letting current user to comment on that post
    if (status === "BLOCKED") return res.status(403).json();
    else {
      const comment = await slonik.maybeOne(sql`
      INSERT INTO comments (body, post_id, user_id)
      VALUES (${body}, ${postId}, ${req.user?.id!!})
      RETURNING *;
    `);

      return res.json(comment);
    }
  } else return res.status(404).json();
};

export const update = async (req: Express.Request, res: Express.Response) => {
  // Getting the updated body
  const { body } = req.body;
  // Getting some parameters
  const { post: postId, comment: commentId } = req.params;

  // Checking if the post exists
  const post = await slonik.maybeOne(sql<Partial<Post>>`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  // Post exists
  if (post) {
    // Checking if the other user has blocked current user
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    if (status === "BLOCKED") return res.status(403).json();
    else {
      // Getting the comment
      const comment = await slonik.maybeOne(sql<Partial<Comment>>`
        SELECT * FROM comments WHERE id = ${commentId};
      `);

      // If comment exists
      if (comment) {
        // If the author of the comment is the same as current user
        if (comment.user_id === req.user?.id!!) {
          // Update the comment
          const comment = await slonik.maybeOne(sql<Partial<Comment>>`
            UPDATE comments 
            SET body = ${body} 
            WHERE id = ${commentId}
            RETURNING *;
          `);

          // Send the updated comment
          return res.json(comment);
        }
        // If the author is not the same
        else return res.status(403).json();
      }
      // If the comment doesn't exist
      else return res.status(404).json();
    }
  }
  // If the post doesn't exist
  else return res.status(404).json();
};

// For deleting a comment
export const remove = async (req: Express.Request, res: Express.Response) => {
  // Getting some params
  const { post: postId, comment: commentId } = req.params;

  // Find the post
  const post = await slonik.maybeOne(sql<Partial<Post>>`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  // If post exists
  if (post) {
    // Checking the relation between accounts
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    // If the other user has blocked current account
    if (status === "BLOCKED") return res.status(403).json();
    else {
      // Find the comment
      const comment = await slonik.maybeOne(sql<Partial<Comment>>`
        SELECT * FROM comments WHERE id = ${commentId};
      `);

      // If comment exists
      if (comment) {
        // If the author of the post is the same
        if (comment.user_id === req.user?.id!!) {
          // Delete the comment
          await slonik.query(sql`
            DELETE FROM comments WHERE id = ${commentId};
          `);
          return res.status(204).json();
        }
        // If the author is different
        else return res.status(403).json();
      }
      // If the comment doesn't exist
      else return res.status(404).json();
    }
  }
};
