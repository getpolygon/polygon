import { User } from "../../types";
import slonik from "../../db/slonik";
import { Request, Response } from "express";
import { InvalidInputError, sql } from "slonik";

// For post discovery
export const posts = async (req: Request, res: Response) => {
  // Getting next page cursor and post limit per page
  let { cursor, limit = 2 } = req.query;

  // Not letting more than 10 posts per page
  if (limit > 10) limit = 2;

  try {
    // TODO: Implement
  } catch (error) {
    if (error instanceof InvalidInputError) return res.status(400).json();
    else {
      console.error(error);
      return res.status(500).json();
    }
  }
};

// For discovering popular accounts
export const accounts = async (req: Request, res: Response) => {
  const { rows: accounts } = await slonik.query(sql<Partial<User>[]>``);
  return res.json(accounts);
};
