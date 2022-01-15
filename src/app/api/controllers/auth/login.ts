import pg from "@db/pg";
import { isNil } from "lodash";
import { createJwt } from "@lib/jwt";
import bcrypt from "@node-rs/bcrypt";
import type { User } from "@dao/entities/User";
import type { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await pg.getFirst<Partial<User>>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  if (!isNil(user)) {
    const correctPassword = await bcrypt.verify(password, user?.password!);
    if (correctPassword) {
      // TODO: This part should be updated

      const access_token = createJwt({ id: user.id }, { expiresIn: "2d" });
      const refresh_token = createJwt({}, { expiresIn: "30d" });

      return res.json({
        access_token,
        refresh_token,
        token_type: "Bearer",
        // 2 days
        expires_in: 1000 * 60 ** 2 * 24 * 2,
      });
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(401);
};

export default login;
