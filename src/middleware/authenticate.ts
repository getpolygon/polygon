import { isNil, nth } from "lodash";
import { verifyJwt } from "util/jwt";
import { userRepository } from "db/dao";
import { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = nth(authorization?.trim().split(" "), 1);

    // Checking if the token exists
    if (isNil(token)) return res.sendStatus(401);

    // Validating the token
    try {
      const data = verifyJwt<any>(token!!);
      // Finding the user with the ID
      // prettier-ignore
      const user = await userRepository.findOne({ key: "id", value: data.id }, ["*"]);

      // If the account does not exist
      if (isNil(user)) return res.sendStatus(401);

      // Setting the user
      req.user = user;

      return next(null);
    } catch (error) {
      // If token is invalid
      if (error instanceof JsonWebTokenError) return res.sendStatus(400);

      console.error(error);
      return res.sendStatus(500);
    }
  };
};
