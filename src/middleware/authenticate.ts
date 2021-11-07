import express from "express";
import type { Token } from "../types";
import getFirst from "../util/getFirst";
import { verifyJwt } from "../util/jwt";
import type { User } from "../types/user";

export default () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const authorization = req.headers["authorization"];
    const [_, token] = authorization?.trim().split(" ")!!;

    // Checking if the token exists
    if (!token) res.sendStatus(401);

    // Getting the ID from the token
    const data = verifyJwt<Token>(token!!);
    // Finding the user with the ID
    const user = await getFirst<User>("SELECT * FROM users WHERE id = $1", [
      data.id,
    ]);

    // If the account does not exist
    if (!user) return res.sendStatus(401);

    // Setting the user
    req.user = user;
    return next();
  };
};
