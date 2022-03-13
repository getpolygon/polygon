import { postDao } from "@container";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

// For fetching one user's post
const ofUser: Handler = async (req, res) => {
  // Get the username from the request
  const { username } = req.params;

  // Get optional the cursor and the limit from the query. It's guaranteed to be
  // a valid UUID string, so we do not need to handle anything else.
  const { cursor, limit } = req.query as unknown as {
    limit: number;
    cursor: string;
  };

  // Get the user's posts from the post DAO
  const posts = await postDao.getPostsOfUserByUsername(
    username,
    req.user?.id!,
    { cursor, limit }
  );

  return new APIResponse(res, { data: posts });
};

export default ofUser;
