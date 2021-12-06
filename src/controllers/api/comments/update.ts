import getFirst from "util/sql/getFirst";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";

// For updating a comment
const update = async (req: Request, res: Response) => {
  // Getting the updated body
  const { body } = req.body;
  // Getting some parameters
  const { post: postId, comment: commentId } = req.params;

  // Checking if the post exists
  const post = await getFirst<{ user_id: string }>(
    "SELECT user_id FROM posts WHERE id = $1",
    [postId]
  );

  if (post) {
    // Checking if the other user has blocked current user
    const status = await checkStatus({
      other: post?.user_id!!,
      current: req.user?.id!!,
    });

    if (status === "BLOCKED") return res.sendStatus(403);
    const comment = await getFirst<{ user_id: string }>(
      "SELECT user_id FROM comments WHERE id = $1",
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
      return res.sendStatus(403);
    }

    // If the comment doesn't exist
    return res.sendStatus(404);
  }

  // If the post doesn't exist
  return res.sendStatus(404);
};

export default update;
