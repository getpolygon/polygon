import { postDao } from "@container";
import type { Request, Response } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For removing a post
const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await postDao.getPostById(id, req.user?.id!);

  // Checking if post exists. This includes checking if post's author
  // is the same as the user making the request.
  if (post !== null) {
    if ((post.user?.id || post.user_id) === req.user?.id) {
      await postDao.deletePostById(id);
      return new APIResponse(res, { data: null, status: 204 });
    } else {
      return new APIErrorResponse(res, {
        status: 403,
        data: { error: "Forbidden operation" },
      });
    }
  } else {
    return new APIErrorResponse(res, {
      status: 403,
      data: { error: "Post does not exist" },
    });
  }
};

export default remove;
