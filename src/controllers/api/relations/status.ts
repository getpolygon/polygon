import getFirst from "../../../util/getFirst";
import type { Request, Response } from "express";
import { Relation } from "../../../types/relation";

// For checking relation status
const status = async (req: Request, res: Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    // Finding the relation
    const relation = await getFirst<Partial<Relation>>(
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
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default status;
