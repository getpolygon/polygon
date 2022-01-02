import pg from "db/pg";
import type { Request, Response } from "express";

// For closing an account
const close = async (req: Request, res: Response) => {
  try {
    await pg.query("DELETE FROM users WHERE id = $1;", [req.user?.id]);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default close;
