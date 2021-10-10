import express from "express";
import getFirst from "../../utils/getFirst";
import type { Post } from "../../types/post";
import type { Comment } from "../../types/comment";
import { checkStatus } from "../../helpers/helpers";

// For creating a comment
const create = async (req: express.Request, res: express.Response) => {
  // Post content
  const { body } = req.body;
  const { post: postId } = req.params;

  try {
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
  } catch (error: any) {
    if (error?.code === "22P02") return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

export default create;
