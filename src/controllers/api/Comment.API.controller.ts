import { InvalidInputError, sql } from "slonik";
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
        RETURNING created_at, body, id;
      `);

      return res.json(comment);
    }
  } else return res.status(404).json();
};

// For updating a comment
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

// For fetching comments of a post
export const fetch = async (req: Express.Request, res: Express.Response) => {
  // Getting the post from the query
  const { post: postId } = req.params;
  // Getting next comment cursor and limit per page
  const { next, limit = 2 } = req.query;

  try {
    // Finding the post
    const post = await slonik.maybeOne(sql<Partial<Post>>`
      SELECT * FROM posts WHERE id = ${postId};
    `);

    // If post doesn't exist
    if (!post) return res.status(404).json();
    else {
      // Checking the relations between current user and post author
      const status = await checkStatus({
        other: post.user_id!!,
        current: req.user?.id!!,
      });

      // If the relation between 2 users is BLOCKED
      if (status === "BLOCKED") return res.status(403).json();
      else {
        // If no comment cursor was supplied
        if (!next) {
          // Fetching the comments
          const comments = await slonik.many(sql<Partial<Comment>>`
            SELECT * FROM comments WHERE post_id = ${post.id!!}
            ORDER BY created_at DESC
            LIMIT ${Number(limit) || 2}
          `);

          // Getting next cursor
          const next =
            comments?.length === 0
              ? null
              : await slonik.maybeOne(sql<Partial<Comment>>`
            SELECT * FROM comments WHERE post_id = ${post.id!!}
            AND id > ${comments[comments.length - 1].id!!}
            AND created_at > ${comments[comments.length - 1].created_at!!}
            ORDER BY created_at DESC
            LIMIT 1;
          `);

          return res.json({
            data: comments,
            next: next?.id,
          });
        } else {
          return res.json("not implemented");
        }
      }
    }
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};
