import pg from "@db/pg";
import type { Request, Response } from "express";

// For getting the followers of an account
const followers = async (req: Request, res: Response) => {
  // The ID of the user
  const { id } = req.params;

  const { rows: followers } = await pg.query(
    `
    SELECT 
      f.* 
    
    FROM relations r

    LEFT OUTER JOIN (
      SELECT 
          id,
          username,
          last_name,
          first_name,
          created_at

      FROM users
    ) f ON r.from_user = f.id

    WHERE r.status = 'FOLLOWING' AND r.to_user = $1;
    `,
    [id]
  );

  return res.json(followers);
};

export default followers;
