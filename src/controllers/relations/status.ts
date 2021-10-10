import express from "express";
import getFirst from "../../utils/getFirst";
import { Relation } from "../../types/relation";

// For checking relation status
const status = async (req: express.Request, res: express.Response) => {
  // The ID of other user
  const { id } = req.params;

  try {
    // Finding the relation
    const relation = await getFirst<Partial<Relation>>(
      `
      SELECT
        status 
      FROM 
        relations 
      WHERE 
        to_user IN ($1, $2) 
        AND 
        from_user IN ($1, $2)
      `,
      [id, req.user?.id]
    );

    return res.json(relation?.status || null);
  } catch (error) {
    // TODO: Handle invalid user UUID errors
    // // If the user id is invalid
    // if (error instanceof InvalidInputError) return res.status(400).json();
    // // Undefined behaviour
    // else {
    //   console.error(error);
    //   return res.status(500).json();
    // }
  }
};

export default status;
