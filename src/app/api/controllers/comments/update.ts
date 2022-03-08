import pg from "@db/pg";
import { relationDao } from "@container";
import type { Request, Response } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For updating a comment
const update = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { post: postId, comment: commentId } = req.params;

  // Checking if the post exists
  const post = await pg.getFirst<{ user_id: string }>(
    "SELECT user_id FROM posts WHERE id = $1",
    [postId]
  );

  if (post !== null) {
    const status = await relationDao.getRelationByUserIds(
      post.user_id,
      req.user?.id!
    );

    if (status === "BLOCKED") {
      return new APIErrorResponse(res, {
        status: 403,
        data: { error: "Forbidden access" },
      });
    } else {
      const comment = await pg.getFirst<{ user_id: string }>(
        "SELECT user_id FROM comments WHERE id = $1",
        [commentId]
      );

      if (comment !== null) {
        if (comment.user_id === req.user?.id) {
          const comment = await pg.getFirst<Partial<Comment>>(
            "UPDATE comments SET body = $1 WHERE id = $2 RETURNING *",
            [body, commentId]
          );

          return new APIResponse(res, { data: comment });
        } else {
          return new APIErrorResponse(res, {
            status: 403,
            data: { error: "Forbidden operation" },
          });
        }
      } else {
        return new APIErrorResponse(res, {
          status: 404,
          data: { error: "Comment does not exist" },
        });
      }
    }
  } else {
    return new APIErrorResponse(res, {
      status: 404,
      data: { error: "Post does not exist" },
    });
  }
};

export default update;
