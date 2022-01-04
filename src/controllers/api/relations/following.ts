import pg from "db/pg";
import { relationDao } from "container";
import type { Request, Response } from "express";

// For getting the people whom the account follows
const following = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Checking the relation between 2 users
    const status = await relationDao.getRelationByUserIds(id, req.user?.id!);

    if (status !== "BLOCKED") {
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
    }

    return res.sendStatus(403);
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default following;
