import { sql } from "slonik";
import slonik from "../../db/slonik";
import { Request, Response } from "express";

export const posts = async (req: Request, res: Response) => {
  const { rows: posts } = await slonik.query(sql`
  
  `);

  return res.json(posts);
};

export const accounts = async (req: Request, res: Response) => {
  const { rows: accounts } = await slonik.query(sql`

  `);

  return res.json(accounts);
};
