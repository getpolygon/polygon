import pg from "@db/pg";
import type { Request, Response } from "express";

const unfollow = async (req: Request, res: Response) => {
  // Other user's ID
  const { id } = req.params;

  if (id === req.user?.id) return res.sendStatus(406);

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
};

export default unfollow;
