import { userDao } from "@container";
import type { Request, Response } from "express";

// For fetching current account details
const me = async (req: Request, res: Response) => {
  const user = await userDao.getUserById(req.user?.id!);
  return res.json(user);
};

export default me;
