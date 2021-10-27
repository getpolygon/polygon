import bcrypt from "bcrypt";
import express from "express";
import getFirst from "../../utils/getFirst";
import { createJwt } from "../../utils/jwt";
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
      const payload = { id: user.id };
      const token = createJwt(payload);

      // Send a signed cookie
      return res
        .cookie("jwt", token, {
          signed: true,
          secure: true,
          httpOnly: true,
          sameSite: "none",
        })
        .sendStatus(204);
    }

    // Passwords do not match
    return res.sendStatus(403);
  }

  // User does not exist
  return res.sendStatus(404);
};

export default login;
