import pg from "@db/pg";
import type { Request, Response } from "express";

// For blocking users
const block = async (req: Request, res: Response) => {
  // Other user's ID
  const { id } = req.params;

  // If the user tries to block himself
  if (id === req.user?.id!) return res.sendStatus(406);
  else {
    /**
     * If there's an existing relation between these users
     * set the status of the relation to blocked, if a relation
     * doesn't exist, then create one
     */
    await pg.query(
      `
      INSERT INTO relations (from_user, to_user, status)
      VALUES ($1, $2, 'BLOCKED') ON CONFLICT (status) 
      DO UPDATE SET status = 'BLOCKED';
      `,
      [id, req.user?.id]
    );

    return res.sendStatus(200);
  }
};

export default block;
