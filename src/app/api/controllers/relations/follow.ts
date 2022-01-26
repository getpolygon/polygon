import pg from "@db/pg";
import { DatabaseError } from "pg";
import { logger } from "@container";
import { Request, Response } from "express";

// For following another user
const follow = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // If the user tries to follow himself
    if (id === req.user?.id) return res.sendStatus(406);

    await pg.query(
      `
      INSERT INTO relations (status, to_user, from_user) 
      VALUES ('FOLLOWING', $1, $2);
      `,
      [id, req.user?.id]
    );

    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof DatabaseError) {
      // Already exists
      if (error.code === "23505") return res.sendStatus(409);
      // When other user doesn't exist
      else if (error.code === "23503") return res.sendStatus(406);
      else {
        logger.error(error);
        return res.sendStatus(500);
      }
    } else {
      logger.error(error);
      return res.sendStatus(500);
    }
  }
};

export default follow;
