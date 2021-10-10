import pg from "../../db/pg";
import express from "express";
import getFirst from "../../utils/getFirst";
import type { Post } from "../../types/post";
import type { Comment } from "../../types/comment";
import checkStatus from "../../utils/checkStatus";

// For fetching comments of a post
const ofPost = async (req: express.Request, res: express.Response) => {
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
  } catch (error: any) {
    if (error?.code === "22P02") return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

export default ofPost;
