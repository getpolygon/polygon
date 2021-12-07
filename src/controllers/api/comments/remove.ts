import pg from "db/pg";
import { isEqual, isNil } from "lodash";
import getFirst from "util/sql/getFirst";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";

// For deleting a comment
const remove = async (req: Request, res: Response) => {
  const { post: postId, comment: commentId } = req.params;

  try {
    // Find the post
    const post = await getFirst<{ user_id: string }>(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );

    // If post exists
    if (post) {
      // Checking the relation between accounts
      const status = await checkStatus({
        other: post?.user_id!!,
        current: req.user?.id!!,
      });

      // If the other user has blocked current account
      if (status === "BLOCKED") return res.sendStatus(403);

      // Find the comment
      const comment = await getFirst<{ user_id: string }>(
        "SELECT user_id FROM comments WHERE id = $1",
        [commentId]
      );

      // If comment exists
      if (!isNil(comment)) {
        // If the author of the post is the same
        if (isEqual(comment.user_id, req.user?.id!!)) {
          // Delete the comment
          await pg.query("DELETE FROM comments WHERE id = $1", [commentId]);
          return res.sendStatus(204);
        }

        // If the author is different
        return res.sendStatus(403);
      }

      // If the comment doesn't exist
      return res.sendStatus(404);
    }
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.status(500).json();
  }
};

export default remove;
