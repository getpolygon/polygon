import { sql } from "slonik";
import Express from "express";
import slonik from "../../db/slonik";

export const create = async (req: Express.Request, res: Express.Response) => {
  const { body } = req.body;
  const { post: postId } = req.params;

  const {
    rows: { 0: post },
  } = await slonik.query(sql`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  if (post) {
    const {
      rows: { 0: comment },
    } = await slonik.query(sql`
      INSERT INTO comments (body, post_id, user_id)
      VALUES (${body}, ${postId}, ${req.user?.id!!})
      RETURNING *;
    `);

    return res.json(comment);
  } else return res.status(404).json();
};

export const update = async (req: Express.Request, res: Express.Response) => {
  const { body } = req.body;
  const { post: postId, comment: commentId } = req.params;

  const {
    rows: { 0: post },
  } = await slonik.query(sql`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  if (post) {
    const {
      rows: { 0: comment },
    } = await slonik.query(sql`
      SELECT * FROM comments WHERE id = ${commentId};
    `);

    if (comment) {
      if (comment.user_id === req.user?.id!!) {
        const {
          rows: { 0: comment },
        } = await slonik.query(sql`
          UPDATE comments 
          SET body = ${body} 
          WHERE id = ${commentId}
          RETURNING *;
        `);
        return res.json(comment);
      } else return res.status(403);
    } else return res.status(404);
  } else return res.status(404).json();
};

export const remove = async (req: Express.Request, res: Express.Response) => {
  const { post: postId, comment: commentId } = req.params;

  // Find the post
  const {
    rows: { 0: post },
  } = await slonik.query(sql`
    SELECT * FROM posts WHERE id = ${postId};
  `);

  // If post exists
  if (post) {
    // Find the comment
    const {
      rows: { 0: comment },
    } = await slonik.query(sql`
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
      // Forbid the request
      else return res.status(403).json();
    } else return res.status(404).json();
  }
};
