import pg from "../../../db/pg";
import express from "express";
import getFirst from "../../../util/getFirst";
import type { Post } from "../../../types/post";
import type { Comment } from "../../../types/comment";
import checkStatus from "../../../util/checkStatus";

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
    if (!post) return res.sendStatus(404);
    else {
      // Checking the relations between current user and post author
      const status = await checkStatus({
        other: post.user_id!!,
        current: req.user?.id!!,
      });

      // If the relation between 2 users is BLOCKED
      if (status === "BLOCKED") return res.sendStatus(403);

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
      }

      return res.json("not implemented");
    }
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default ofPost;
