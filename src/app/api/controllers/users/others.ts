import { isNil } from "lodash";
import { userDao } from "container";
import type { Request, Response } from "express";

// For fetching other accounts
const others = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await userDao.getUserByUsername(username);
  if (isNil(user)) return res.sendStatus(404);
  else return res.json(user);
};

export default others;
