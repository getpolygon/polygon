import pg from "@db/pg";
import type { Request, Response } from "express";

// For getting the people whom the account follows
const following = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Getting the users other user follows
  const { rows: following } = await pg.query(
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
    ) f ON r.to_user = f.id

    WHERE r.from_user = $1 AND r.status = 'FOLLOWING';
    `,
    [id]
  );

  return res.json(following);
};

export default following;
