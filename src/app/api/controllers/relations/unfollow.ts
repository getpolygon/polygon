import pg from "@db/pg";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const unfollow: Handler = async (req, res) => {
  const { id } = req.params;

  if (id === req.user?.id) {
    return new APIErrorResponse(res, {
      status: 406,
      data: { error: "Forbidden operation" },
    });
  } else {
    await pg.query(
      "DELETE FROM relations WHERE to_user = $1 AND from_user = $2 AND status = 'FOLLOWING'",
      [id, req.user?.id]
    );

    return new APIResponse(res, { data: null, status: 204 });
  }
};

export default unfollow;
