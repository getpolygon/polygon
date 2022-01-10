import { isNil, nth } from "lodash";
import { verifyJwt } from "lib/jwt";
import { logger, userDao } from "container";
import { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionJwt = req.session.token;
    const authorization = req.headers.authorization;
    const bearerJwt = nth(authorization?.split(" "), 1);

    // Initially we are trying to get the bearer token
    // from headers. If the bearer token does not exist
    // then we are checking whether there is a token in
    // the session.
    const token = bearerJwt || sessionJwt;
    if (isNil(token)) return res.sendStatus(401);

    try {
      // Validating the token and getting the user
      const data = verifyJwt<{ id: string }>(token);
      const user = await userDao.getUserById(data.id);

      // If the account does not exist
      if (isNil(user)) return res.sendStatus(401);
      else {
        req.user = user;
        return next(null);
      }
    } catch (error) {
      // If token is invalid
      if (error instanceof JsonWebTokenError) return res.sendStatus(403);
      else {
        logger.error(error);
        return res.sendStatus(500);
      }
    }
  };
};
