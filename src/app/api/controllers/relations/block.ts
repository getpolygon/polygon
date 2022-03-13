import pg from "@db/pg";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const block: Handler = async (req, res) => {
  const { id } = req.params;

  // If the user tries to block himself
  if (id === req.user?.id!) {
    return new APIErrorResponse(res, {
      status: 406,
      data: { error: "Forbidden operation" },
    });
  } else {
    /**
     * If there's an existing relation between these users set the status
     * of the relation to blocked, if a relation doesn't exist, then create one
     */
    await pg.query(
      `
      INSERT INTO relations (from_user, to_user, status)
      VALUES ($1, $2, 'BLOCKED') ON CONFLICT (status) 
      DO UPDATE SET status = 'BLOCKED';
      `,
      [id, req.user?.id]
    );

    return new APIResponse(res, { data: null });
  }
};

export default block;
