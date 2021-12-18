import { isNil, nth } from "lodash";
import { userDao } from "container";
import { verifyJwt } from "util/jwt";
import { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = nth(authorization?.trim().split(" "), 1);

    // Checking if the token exists
    if (isNil(token)) return res.sendStatus(401);

    try {
      // Validating the token and getting the user
      const data = verifyJwt<{ id: string }>(token);
      const user = await userDao.getUserById(data.id);

      // If the account does not exist
      if (isNil(user)) return res.sendStatus(401);

      // Setting the user
      req.user = user;

      return next(null);
    } catch (error) {
      // If token is invalid
      if (error instanceof JsonWebTokenError) return res.sendStatus(403);

      console.error(error);
      return res.sendStatus(500);
    }
  };
};
