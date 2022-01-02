import { isNil } from "lodash";
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "util/jwt";
import getFirst from "util/sql/getFirst";
import type { User } from "dao/entities/User";
import type { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await getFirst<Partial<User>>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  if (!isNil(user)) {
    const correctPassword = await bcrypt.verify(password, user?.password!);
    if (correctPassword) {
      const token = createJwt({ id: user.id });
      return res.json({ token });
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(401);
};

export default login;
