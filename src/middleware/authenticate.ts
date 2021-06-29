// Will be used for adding types
import Express from "express";
import jwt from "jsonwebtoken";
import { Token } from "../@types";
const { JWT_PRIVATE_KEY } = process.env;
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default () => {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    // Getting the `jwt` cookie
    const { jwt: token } = req.signedCookies;

    // Checking if it exists
    if (!token) return res.status(403).send();
    else {
      // Getting the ID from the token
      const data = jwt.verify(token, JWT_PRIVATE_KEY!!) as Token;
      // Finding the user with the ID
      const user = await prisma.user.findFirst({
        where: {
          id: data.id,
        },
        include: {
          posts: true,
          comments: true,
          notifications: true,
        },
      });
      // If there's no such account, forbid the request
      if (!user) return res.status(403).send();
      // Move on to the next handler
      else {
        req.user = user;
        return next();
      }
    }
  };
};
