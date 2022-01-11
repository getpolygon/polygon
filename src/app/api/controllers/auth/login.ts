import pg from "@db/pg";
import { isNil } from "lodash";
import { createJwt } from "@lib/jwt";
import bcrypt from "@node-rs/bcrypt";
import type { User } from "@dao/entities/User";
import type { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();

  // Find the user by email
  const user = await pg.getFirst<Partial<User>>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  if (!isNil(user)) {
    const correctPassword = await bcrypt.verify(password, user?.password!);
    if (correctPassword) {
      const access = createJwt({ id: user.id }, { expiresIn: "2d" });
      const refresh = createJwt({}, { expiresIn: "30d" });
      return res.json({ access, refresh, user });
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(401);
};

export default login;
