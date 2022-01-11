import pg from "@db/pg";
import { relationDao } from "@container";
import type { Request, Response } from "express";

// For getting the followers of an account
const followers = async (req: Request, res: Response) => {
  // The ID of the user
  const { id } = req.params;

  // Checking the status between 2 users
  const status = await relationDao.getRelationByUserIds(id, req.user?.id!);

  if (status !== "BLOCKED") {
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
  }

  return res.sendStatus(403);
};

export default followers;
