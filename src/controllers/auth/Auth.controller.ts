import { sql } from "slonik";
import Express from "express";
import jwt from "jsonwebtoken";
import slonik from "../../db/slonik";
const { JWT_PRIVATE_KEY } = process.env;
import { Token, User } from "../../@types";

export default async (req: Express.Request, res: Express.Response) => {
  const { jwt: token } = req.signedCookies;

  if (!token) return res.status(403).json();
  else {
    const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
    const {
      rows: { 0: user },
    } = await slonik.query(sql<User>`
    SELECT 
      username, 
      first_name, 
      last_name, 
      private, 
      id, 
      created_at, 
      avatar, 
      cover 
    
    FROM users 
    WHERE id = ${data.id};
  `);

    if (!user) return res.status(404).json();
    else return res.send(user);
  }
};
