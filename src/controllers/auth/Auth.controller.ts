import { sql } from "slonik";
import Express from "express";
import jwt from "jsonwebtoken";
import { Token } from "../../@types";
import slonik from "../../db/slonik";
const { JWT_PRIVATE_KEY } = process.env;

export default async (req: Express.Request, res: Express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (!token) return res.status(401).json();
  else {
    const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
    const {
      rows: { 0: user },
    } = await slonik.query(sql`
    SELECT 
      id,
      cover,
      avatar,
      private,
      username, 
      last_name,
      first_name,
      created_at

    FROM users 
    WHERE id = ${data.id};
  `);

    if (!user) return res.status(404).json();
    else return res.send(user);
  }
};
