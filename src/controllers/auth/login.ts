import { isNil } from "lodash";
import { userDao } from "container";
import { createJwt } from "util/jwt";
import bcrypt from "@node-rs/bcrypt";
import type { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { password } = req.body;
  const email = String(req.body.email).toLowerCase();

  // Find the user by email
  const user = await userDao.getUserByEmail(email);

  if (!isNil(user)) {
    const correctPassword = await bcrypt.verify(password, user?.password!);
    if (correctPassword) {
      const token = createJwt({ id: user.id });
      req.session.token = token;

      return res.json({ token });
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(401);
};

export default login;
