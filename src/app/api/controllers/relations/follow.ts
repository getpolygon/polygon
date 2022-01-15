import pg from "@db/pg";
import { DatabaseError } from "pg";
import { Request, Response } from "express";
import { logger, relationDao } from "@container";
import type { Status } from "@dao/entities/Relation";

// For following another user
const follow = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // If the user tries to follow himself
    if (id === req.user?.id) return res.sendStatus(406);

    // Checking if the other user has blocked current user
    const status = await relationDao.getRelationByUserIds(id!, req.user?.id!);
    if (status !== "BLOCKED") {
      // Creating the relation
      const response = await pg.getFirst<{ status: Status }>(
        `
        INSERT INTO relations (status, to_user, from_user) 
        VALUES ('FOLLOWING', $1, $2) RETURNING status;
        `,
        [id, req.user?.id]
      );

      // Sending the status
      return res.json(response?.status || null);
    }

    return res.sendStatus(403);
  } catch (error) {
    if (error instanceof DatabaseError) {
      // TODO: Handle all errors
      // Already exists
      if (error.code === "23505") return res.sendStatus(409);

      // // When other user doesn't exist
      // if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
      //   return res.status(404).json();
      // }
      // // When same user tries to follow himself
      // else if (error instanceof UniqueIntegrityConstraintViolationError) {
      //   return res.status(409).json();
      // }
    } else {
      logger.error(error);
      return res.sendStatus(500);
    }
  }
};

export default follow;
