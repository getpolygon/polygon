import { isNil } from "lodash";
import { relationDao } from "container";
import getFirst from "util/sql/getFirst";
import type { Request, Response } from "express";

// For creating a comment
const create = async (req: Request, res: Response) => {
  // Post content
  const { content } = req.body;
  const { post: postId } = req.params;

  try {
    const post = await getFirst<{ user_id: string }>(
      "SELECT user_id FROM posts WHERE id = $1;",
      [postId]
    );

    if (!isNil(post)) {
      // Checking if the other user has blocked current user
      // prettier-ignore
      const status = await relationDao.getRelationByUserIds(post.user_id, req.user?.id!);

      // Not letting current user to comment on that post
      if (status === "BLOCKED") return res.sendStatus(403);
      else {
        // Creating a comment and returning it afterwards
        const comment = await getFirst<Partial<Comment>>(
          `
          INSERT INTO comments (content, post_id, user_id) 
          VALUES ($1, $2, $3)
          RETURNING created_at, content, id;
          `,
          [content, postId, req.user?.id]
        );

        return res.json(comment);
      }
    }

    // Post was not found
    return res.sendStatus(404);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json();
  }
};

export default create;
