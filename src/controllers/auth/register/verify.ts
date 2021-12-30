import redis from "db/redis";
import { isNil } from "lodash";
import { compare } from "bcrypt";
import type { Payload } from ".";
import { userDao } from "container";
import { createJwt } from "util/jwt";
import { User } from "dao/entities/User";
import type { Request, Response } from "express";

const verify = async (req: Request, res: Response) => {
  const { token: suppliedToken } = req.params;
  const { password: suppliedPassword } = req.body;

  // Getting the verification token from Redis
  const redisPayload = await redis.get(`verif:${suppliedToken}`);

  if (!isNil(redisPayload)) {
    const parsed = JSON.parse(redisPayload) as Payload;
    const correctPassword = await compare(suppliedPassword, parsed.password);

    if (correctPassword) {
      // Creating a user
      const user = await userDao.createUser(
        new User(
          parsed.email,
          parsed.password,
          parsed.username,
          parsed.lastName,
          parsed.firstName
        )
      );

      // Deleting the verification token from Redis
      await redis.del(`verif:${suppliedToken}`);
      const token = createJwt({ id: user?.id });
      return res.status(201).json({ ...user, token });
    } else return res.sendStatus(401);
  } else return res.sendStatus(401);
};

export default verify;
