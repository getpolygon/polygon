import pg from "@db/pg";
import type { Request, Response } from "express";
import type { Status } from "@dao/entities/Relation";
import { APIResponse } from "@app/api/common/APIResponse";

// For checking relation status
const status = async (req: Request, res: Response) => {
  const relation = await pg.getFirst<{ status?: Status }>(
    `
    SELECT status FROM relations
    WHERE
      to_user IN ($1, $2)
    AND
      from_user IN ($1, $2)
    `,
    [req.params.id, req.user?.id]
  );

  return new APIResponse(res, { data: relation.status });
};

export default status;
