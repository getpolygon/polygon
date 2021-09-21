import { sql } from "slonik";
import express from "express";
import jwt from "jsonwebtoken";
import { Token, User } from "../@types";
import getFirst from "../utils/db/getFirst";
const { JWT_PRIVATE_KEY } = process.env;

export default (authRoute = false) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Getting the `jwt` cookie
    const { jwt: token } = req.signedCookies;

    // Checking if the token exists
    if (!token) {
      // If the request was from an auth endpoint
      if (authRoute) return next();
      else return res.status(401).json();
    } else {
      // Getting the ID from the token
      const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
      // Finding the user with the ID
      const user = await getFirst<User>("SELECT * FROM users WHERE id = $1", [
        data.id,
      ]);

      // If the account does not exist
      if (!user) {
        // If the request was from auth endpoint
        if (authRoute) return next();
        else return res.status(401).json();
      } else {
        // Setting the user
        req.user = user;

        // If the request was from auth endpoint
        if (authRoute) return res.status(403).json();
        else return next();
      }
    }
  };
};
