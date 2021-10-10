import pg from "../../db/pg";
import express from "express";
import getFirst from "../../utils/getFirst";
import type { Post } from "../../types/post";
import type { Comment } from "../../types/comment";
import checkStatus from "../../utils/checkStatus";

// For deleting a comment
const remove = async (req: express.Request, res: express.Response) => {
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
        } catch (error: any) {
          console.error(error);
          if (error?.code === "22P02") return res.status(400).json();
          else {
            console.error(error);
            return res.status(500).json();
          }
        }
      }
    }
  } catch (error: any) {
    if (error?.code === "22P02") return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

export default remove;
