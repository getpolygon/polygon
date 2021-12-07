import pg from "db/pg";
import checkStatus from "util/sql/checkStatus";
import type { Request, Response } from "express";
import { isEqual } from "lodash";

// For getting the followers of an account
const followers = async (req: Request, res: Response) => {
  // The ID of the user
  const { id } = req.params;

  try {
    // Checking the status between 2 users
    const status = await checkStatus({
      other: id,
      current: req.user?.id!!,
    });

    // If current user is blocked by the other one
    if (isEqual(status, "BLOCKED")) {
      const { rows: followers } = await pg.query(
        `
            SELECT Follower.* FROM relations Relation
      
            LEFT OUTER JOIN (
              SELECT 
                  id,
                  cover,
                  avatar,
                  username,
                  last_name,
                  first_name
      
              FROM users
            ) Follower ON Relation.from_user = Follower.id
      
            WHERE Relation.status = 'FOLLOWING' 
            AND Relation.to_user = $1;
            `,
        [id]
      );

      return res.json(followers);
    }

    return res.sendStatus(403);
  } catch (error: any) {
    // Invalid user ID
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default followers;
