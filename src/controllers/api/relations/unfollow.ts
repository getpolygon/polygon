import pg from "db/pg";
import { isEqual } from "lodash";
import type { Request, Response } from "express";

const unfollow = async (req: Request, res: Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    if (isEqual(id, req.user?.id)) return res.sendStatus(406);

    // Deleting the relation
    await pg.query(
      `
        DELETE FROM 
          relations 
        
        WHERE 
            to_user = $1 
            AND 
            from_user = $2 
            AND
            status = 'FOLLOWING'
        `,
      [id, req.user?.id]
    );

    return res.sendStatus(204);
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default unfollow;
