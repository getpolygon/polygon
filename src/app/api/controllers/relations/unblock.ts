import pg from "@db/pg";
import type { Request, Response } from "express";

// For unblocking users
const unblock = async (req: Request, res: Response) => {
  // Other user's ID
  const { id } = req.params;

  // If the user is trying to unblock himself
  if (id === req.user?.id) return res.sendStatus(406);

  await pg.query(
    `
    DELETE FROM relations
    WHERE
      from_user IN ($1, $2) 
    AND 
      to_user IN ($1, $2)
    AND 
      status = 'BLOCKED'
    `,
    [req.user?.id, id]
  );

  return res.sendStatus(200);
};

export default unblock;
