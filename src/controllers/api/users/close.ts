import { userDao } from "container";
import type { Request, Response } from "express";

// For closing an account
const close = async (req: Request, res: Response) => {
  await userDao.deleteUserById(req.user?.id!);
  return res.sendStatus(204);
};

export default close;
