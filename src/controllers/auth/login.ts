import bcrypt from "bcrypt";
import express from "express";
import getFirst from "../../util/getFirst";
import { createJwt } from "../../util/jwt";
import type { User } from "../../types/user";

const login = async (req: express.Request, res: express.Response) => {
  const { password, email } = req.body;
  const user = await getFirst<User>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user) {
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
