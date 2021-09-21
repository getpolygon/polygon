import express from "express";
import jwt from "jsonwebtoken";
import getFirst from "../../utils/db/getFirst";
import type { Token, User } from "../../@types";

const { JWT_PRIVATE_KEY } = process.env;

export default async (req: express.Request, res: express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (!token) return res.status(401).json();
  else {
    const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
    const user = await getFirst<Partial<User>>(
      `
      SELECT 
        id,
        cover,
        avatar,
        private,
        username, 
        last_name,
        first_name,
        created_at

      FROM users WHERE id = $1;
      `,
      [data.id]
    );

    if (!user)
      return res
        .status(404)
        .clearCookie("jwt", {
          signed: true,
          secure: true,
          httpOnly: true,
          sameSite: "none",
        })
        .json();
    else return res.json(user);
  }
};
