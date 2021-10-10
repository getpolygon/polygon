import express from "express";
import jwt from "jsonwebtoken";
import type { Token } from "../types";
import getFirst from "../utils/getFirst";
import type { User } from "../types/user";

const { JWT_PRIVATE_KEY } = process.env;

export default () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { jwt: token } = req.signedCookies;

    // Checking if the token exists
    if (!token) res.status(401).json();
    else {
      // Getting the ID from the token
      const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
      // Finding the user with the ID
      const user = await getFirst<User>("SELECT * FROM users WHERE id = $1", [
        data.id,
      ]);

      // If the account does not exist
      if (!user) return res.status(401).json();
      else {
        // Setting the user
        req.user = user;
        return next();
      }
    }
  };
};
