import express from "express";
import pg from "../../../db/pg";

const unfollow = async (req: express.Request, res: express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    if (id === req?.user?.id!!) return res.sendStatus(406);

    // Deleting the relation
    await pg.query(
      `
        DELETE FROM 
          relations 
        
        WHERE 
            to_user = $1 
            AND 
            from_user = $2 
            AND
            status = 'FOLLOWING'
        `,
      [id, req?.user?.id]
    );

    return res.json(null);
  } catch (error: any) {
    if (error?.code === "22P02") return res.sendStatus(400);

    console.error(error);
    return res.sendStatus(500);
  }
};

export default unfollow;
