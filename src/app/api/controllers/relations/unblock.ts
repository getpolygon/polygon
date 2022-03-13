import pg from "@db/pg";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

// For unblocking users
const unblock: Handler = async (req, res) => {
  const { id } = req.params;

  // If the user is trying to unblock himself
  if (id === req.user?.id) {
    return new APIErrorResponse(res, {
      status: 406,
      data: { error: "Forbidden operation" },
    });
  } else {
    await pg.query(
      "DELETE FROM relations WHERE from_user IN ($1, $2) AND to_user IN ($1, $2) AND status = 'BLOCKED'",
      [req.user?.id, id]
    );

    return new APIResponse(res, { data: null, status: 204 });
  }
};

export default unblock;
