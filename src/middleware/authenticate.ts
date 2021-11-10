import { verifyJwt } from "../util/jwt";
import getFirst from "../util/getFirst";
import { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers["authorization"];
    const [_, token] = authorization?.trim().split(" ")!!;

    // Checking if the token exists
    if (!token) res.sendStatus(401);

    // Validating the token
    try {
      const data = verifyJwt<any>(token!!);
      // Finding the user with the ID
      const user = await getFirst<any>("SELECT * FROM users WHERE id = $1", [
        data.id,
      ]);

      // If the account does not exist
      if (!user) return res.sendStatus(401);

      // Setting the user
      req.user = user;

      return next();
    } catch (error) {
      // If token is invalid
      if (error instanceof JsonWebTokenError) return res.sendStatus(400);

      console.error(error);
      return res.sendStatus(500);
    }
  };
};
