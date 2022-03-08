import pg from "@db/pg";
import { relationDao } from "@container";
import type { Request, Response } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For deleting a comment
const remove = async (req: Request, res: Response) => {
  const { post: postId, comment: commentId } = req.params;

  // Find the post
  const post = await pg.getFirst<{ user_id: string }>(
    "SELECT user_id FROM posts WHERE id = $1",
    [postId]
  );

  // If post exists
  if (post) {
    const status = await relationDao.getRelationByUserIds(
      post?.user_id,
      req.user?.id!
    );

    if (status === "BLOCKED") {
      return new APIErrorResponse(res, {
        status: 403,
        data: { error: "Forbidden access" },
      });
    }

    const comment = await pg.getFirst<{ user_id: string }>(
      "SELECT user_id FROM comments WHERE id = $1",
      [commentId]
    );

    if (comment !== null) {
      if (comment.user_id === req.user?.id!) {
        await pg.query("DELETE FROM comments WHERE id = $1", [commentId]);
        return new APIResponse(res, { data: null, status: 204 });
      } else {
        return new APIErrorResponse(res, {
          status: 403,
          data: { error: "Forbidden operation" },
        });
      }
    }

    return new APIErrorResponse(res, {
      status: 404,
      data: { error: "Comment does not exist" },
    });
  }
};

export default remove;
