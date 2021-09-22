import pg from "../../db/pg";
import express from "express";
import type { Post } from "../../@types/post";
import getFirst from "../../utils/db/getFirst";
import { checkStatus } from "../../helpers/helpers";
import type { Comment } from "../../@types/comment";

// For creating a comment
export const create = async (req: express.Request, res: express.Response) => {
  // Post content
  const { body } = req.body;
  const { post: postId } = req.params;

  const post = await getFirst<Post>("SELECT * FROM posts WHERE id = $1;", [
    postId,
  ]);

  if (post) {
    // Checking if the other user has blocked current user
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    // Not letting current user to comment on that post
    if (status === "BLOCKED") return res.status(403).json();
    else {
      // Creating a comment and returning it afterwards
      const comment = await getFirst<Partial<Comment>>(
        `
        INSERT INTO comments (body, post_id, user_id) 
        VALUES ($1, $2, $3)
        RETURNING created_at, body, id;
        `,
        [body, postId, req.user?.id]
      );

      return res.json(comment);
    }
  } else return res.status(404).json();
};

// For updating a comment
export const update = async (req: express.Request, res: express.Response) => {
  // Getting the updated body
  const { body } = req.body;
  // Getting some parameters
  const { post: postId, comment: commentId } = req.params;

  // Checking if the post exists
  const post = await getFirst<Post>("SELECT * FROM posts WHERE id = $1", [
    postId,
  ]);

  if (post) {
    // Checking if the other user has blocked current user
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    if (status === "BLOCKED") return res.status(403).json();
    else {
      const comment = await getFirst<Comment>(
        "SELECT * FROM comments WHERE id = $1",
        [commentId]
      );

      // If comment exists
      if (comment) {
        // If the author of the comment is the same as current user
        if (comment.user_id === req.user?.id!!) {
          // Update the comment
          const comment = await getFirst<Partial<Comment>>(
            "UPDATE comments SET body = $1WHERE id = $2 RETURNING *",
            [body, commentId]
          );

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
export const remove = async (req: express.Request, res: express.Response) => {
  const { post: postId, comment: commentId } = req.params;

  try {
    // Find the post
    const post = await getFirst<Post>("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

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
        try {
          // Find the comment
          const comment = await getFirst<Comment>(
            "SELECT * FROM comments WHERE id = $1",
            [commentId]
          );

          // If comment exists
          if (comment) {
            // If the author of the post is the same
            if (comment.user_id === req.user?.id!!) {
              // Delete the comment
              await pg.query("DELETE FROM comments WHERE id = $1", [commentId]);
              return res.status(204).json();
            }
            // If the author is different
            else return res.status(403).json();
          }
          // If the comment doesn't exist
          else return res.status(404).json();
        } catch (error) {
          // TODO: Handle invalid comment UUID errors
        }
      }
    }
  } catch (error) {
    // TODO: Handle invalid post UUID errors
  }
};

// For fetching comments of a post
export const fetch = async (req: express.Request, res: express.Response) => {
  // Getting the post from the query
  const { post: postId } = req.params;
  // Getting next comment cursor and limit per page
  const { next, limit = 2 } = req.query;

  try {
    // Finding the post
    const post = await getFirst<Post>("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

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
          const { rows: comments } = (await pg.query(
            `
            SELECT * FROM comments WHERE post_id = $1
            ORDER BY created_at DESC LIMIT $2
            `,
            [post.id, Number(limit) || 2]
          )) as { rows: Comment[] };

          // Getting next cursor
          const next = (await (async () => {
            if (comments.length === 0) return null;

            const nextComment = await getFirst(
              `
              SELECT * FROM comments WHERE post_id = $1
              AND id > $2 AND created_at > $3
              ORDER BY created_at DESC LIMIT 1;
              `,
              [
                post.id,
                comments[comments.length - 1].id,
                comments[comments.length - 1].created_at,
              ]
            );
            return nextComment;
          })()) as Comment | null;

          return res.json({
            data: comments,
            next: next?.id,
          });
        } else return res.json("not implemented");
      }
    }
  } catch (error) {
    // TODO: Handle invalid comment UUID errors
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};
