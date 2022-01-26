import { isNil } from "lodash";
import { verifyJwt } from "@lib/jwt";
import { logger, userDao } from "@container";
import type { Handler, Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default (): Handler => {
  return async (req: Request, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (isNil(token)) return res.sendStatus(401);

    try {
      const data = verifyJwt<{ id: string }>(token);
      const user = await userDao.getUserById(data.id);
      req.user = user!;
      return next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) return res.sendStatus(400);
      else if (error instanceof TokenExpiredError) return res.sendStatus(401);
      else {
        logger.error(error);
        return res.sendStatus(500);
      }
    }
  };
};
