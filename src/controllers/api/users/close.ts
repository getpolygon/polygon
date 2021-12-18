import pg from "db/pg";
import type { Request, Response } from "express";

// For closing an account
const close = async (req: Request, res: Response) => {
  try {
    // prettier-ignore
    await pg.query("DELETE FROM relations WHERE from_user = $1 OR to_user = $1;", [req.user?.id]);
    await pg.query("DELETE FROM posts WHERE user_id = $1;", [req.user?.id]);
    await pg.query("DELETE FROM upvotes WHERE user_id = $1;", [req.user?.id]);
    await pg.query("DELETE FROM comments WHERE user_id = $1;", [req.user?.id]);
    await pg.query("DELETE FROM users WHERE id = $1;", [req.user?.id]);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default close;
