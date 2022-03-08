import { upvoteDao } from "@container";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";

/**
 * This endpoint is used for removing an upvote
 * from a post. The endpoint always returns `204`
 * as a response without the guarantee that the
 * post or the upvote exists.
 */
const remove: Handler = async (req, res) => {
  await upvoteDao.deleteUpvote(req.params.id, req.user?.id!);
  return new APIResponse(res, { status: 204, data: null });
};

export default remove;
