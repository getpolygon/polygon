import bcrypt from "bcrypt";
import { isNil } from "lodash";
import { createJwt } from "util/jwt";
import getFirst from "util/sql/getFirst";
import type { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  const { password, email } = req.body;
  const user = await getFirst<{ id: string; password: string }>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  // User exists
  if (!isNil(user)) {
    // If passwords match
    const same = await bcrypt.compare(password, user.password);

    if (same) {
      // Create a JWT
      const token = createJwt({ id: user.id });

      // Send the token
      return res.json({ token });
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(404);
};

export default login;
