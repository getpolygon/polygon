// Will be used for adding types
import Express from "express";
import jwt from "jsonwebtoken";
import { sql } from "slonik";
import { Token, User } from "../@types";
import slonik from "../db/slonik";
const { JWT_PRIVATE_KEY } = process.env;

export default (authRoute = false) => {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    // Getting the `jwt` cookie
    const { jwt: token } = req.signedCookies;

    // Checking if it exists
    if (!token) {
      if (authRoute) return next();
      else return res.status(403).json();
    } else {
      // Getting the ID from the token
      const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
      // Finding the user with the ID
      const response = await slonik.query<User>(sql`
        SELECT * FROM users WHERE id = ${data.id};
      `);

      // Getting the user
      const user = response.rows[0];

      // If the account does not exist
      if (!user) {
        // If the request was from auth endpoint
        if (authRoute) return next();
        // If the request was from other endpoints
        else return res.status(403).json();
      } else {
        req.user = user;
        // If the request was from auth endpoint
        if (authRoute) return res.status(403).json();
        // If the request was from other endpoints
        else return next();
      }
    }
  };
};
