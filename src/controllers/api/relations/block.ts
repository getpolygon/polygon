import { isEqual } from "lodash";
import getFirst from "util/sql/getFirst";
import type { Request, Response } from "express";

// For blocking users
const block = async (req: Request, res: Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    // If the user tries to block himself
    if (isEqual(id, req?.user?.id!!)) return res.sendStatus(406);
    else {
      /**
       * If there's an existing relation between these users
       * set the status of the relation to blocked, if a relation
       * doesn't exist, then create one
       */
      const relation = await getFirst<any>(
        `
        INSERT INTO relations (from_user, to_user, status)
        VALUES ($1, $2, 'BLOCKED') ON CONFLICT (status) 
        DO UPDATE SET status = 'BLOCKED' RETURNING status;
        `,
        [id, req.user?.id]
      );

      return res.json(relation?.status);
    }
  } catch (error: any) {
    // Invalid user ID
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default block;
