import express from "express";
import getFirst from "../../../utils/getFirst";
import type { Relation } from "../../../types/relation";
import checkStatus from "../../../utils/checkStatus";

// For following another user
const follow = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  try {
    // If the user tries to follow himself
    if (id === req.user?.id) return res.sendStatus(406);
    else {
      // Checking if the other user has blocked current user
      const status = await checkStatus({
        other: id!!,
        current: req.user?.id!!,
      });

      // Not blocked
      if (status !== "BLOCKED") {
        // Creating the relation
        const response = await getFirst<Partial<Relation>>(
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
    }
  } catch (error: any) {
    // TODO: Handle all error cases
    // Invalid UUID
    if (error?.code === "22P02") return res.sendStatus(400);
    else {
      console.error(error);
      return res.sendStatus(500);
    }
    // // When other user doesn't exist
    // if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
    //   return res.status(404).json();
    // }
    // // When same user tries to follow himself
    // else if (error instanceof UniqueIntegrityConstraintViolationError) {
    //   return res.status(409).json();
    // }
  }
};

export default follow;
