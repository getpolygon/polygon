import pg from "@db/pg";
import type { Handler } from "express";
import { relationDao } from "@container";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For creating a comment
const create: Handler = async (req, res) => {
  // Post content
  const { content } = req.body;
  const { post: postId } = req.params;

  const post = await pg.getFirst<{ user_id: string }>(
    "SELECT user_id FROM posts WHERE id = $1;",
    [postId]
  );

  if (post !== null) {
    // Checking if the other user has blocked current user
    const status = await relationDao.getRelationByUserIds(
      post.user_id,
      req.user?.id!
    );

    // Not letting current user to comment on that post
    if (status === "BLOCKED") {
      return new APIErrorResponse(res, {
        status: 403,
        data: { message: "Forbidden access" },
      });
    } else {
      const comment = await pg.getFirst<Partial<Comment>>(
        `
        INSERT INTO comments (content, post_id, user_id) 
        VALUES ($1, $2, $3)
        RETURNING id, content, created_at;
        `,
        [content, postId, req.user?.id]
      );

      return new APIResponse(res, { data: comment });
    }
  }

  return new APIErrorResponse(res, {
    status: 404,
    data: { message: "Post not found" },
  });
};

export default create;
