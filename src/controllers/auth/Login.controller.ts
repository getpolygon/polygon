import bcrypt from "bcrypt";
import express from "express";
import getFirst from "../../utils/getFirst";
import { createJwt } from "../../utils/jwt";
import type { User } from "../../types/user";

export default async (req: express.Request, res: express.Response) => {
  const { password, email } = req.body;

  const user = await getFirst<User>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user) {
    const same = await bcrypt.compare(password, user.password);

    // If passwords match
    if (same) {
      // Create a JWT
      const payload = { id: user.id };
      const token = createJwt(payload);

      // Send a signed cookie
      return res.status(204).cookie("jwt", token, {
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
    } else return res.status(403).json();
  } else return res.status(404).json();
};
