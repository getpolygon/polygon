import { userDao } from "container";
import type { Request, Response } from "express";

// For closing an account
const close = async (req: Request, res: Response) => {
  try {
    await userDao.deleteUserById(req.user?.id!);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default close;
