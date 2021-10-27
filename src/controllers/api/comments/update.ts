import express from "express";
import getFirst from "../../../utils/getFirst";
import type { Post } from "../../../types/post";
import { Comment } from "../../../types/comment";
import checkStatus from "../../../utils/checkStatus";

// For updating a comment
const update = async (req: express.Request, res: express.Response) => {
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

export default update;
