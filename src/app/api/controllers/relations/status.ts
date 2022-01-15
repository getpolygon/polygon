import pg from "@db/pg";
import type { Request, Response } from "express";
import type { Status } from "@dao/entities/Relation";

// For checking relation status
const status = async (req: Request, res: Response) => {
  // The ID of other user
  const { id } = req.params;

  // Finding the relation
  const relation = await pg.getFirst<{ status: Status }>(
    `
    SELECT
      status 
    FROM 
      relations 
    WHERE 
      to_user IN ($1, $2) 
      AND 
      from_user IN ($1, $2)
    `,
    [id, req.user?.id]
  );

  return res.json(relation?.status || null);
};

export default status;
