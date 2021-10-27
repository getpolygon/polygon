import pg from "../../../db/pg";
import express from "express";

// For unblocking users
const unblock = async (req: express.Request, res: express.Response) => {
  // Other user's ID
  const { id } = req.params;

  try {
    // If the user is trying to unblock himself
    if (id === req?.user?.id) return res.status(406).json();
    else {
      await pg.query(
        "DELETE FROM relations WHERE from_user = $1 AND to_user = $2 AND status = 'BLOCKED'",
        [req.user?.id, id]
      );

      return res.status(200).json();
    }
  } catch (error: any) {
    if (error?.code === "22P02") return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

export default unblock;
