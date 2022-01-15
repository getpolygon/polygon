import redis from "@db/redis";
import { isNil } from "lodash";
import { userDao } from "@container";
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "@lib/jwt";
import type { Payload } from "./register";
import { User } from "@dao/entities/User";
import type { Request, Response } from "express";

const verify = async (req: Request, res: Response) => {
  const { token: suppliedToken } = req.params;
  const { password: suppliedPassword } = req.body;

  // Getting the verification token from Redis
  const redisPayload = await redis.get(`verif:${suppliedToken}`);

  if (!isNil(redisPayload)) {
    const parsed = JSON.parse(redisPayload) as Payload;
    const correctPassword = await bcrypt.verify(
      suppliedPassword,
      parsed.password
    );

    if (correctPassword) {
      const [user] = await Promise.all([
        // Creating a user
        await userDao.createUser(
          new User(
            parsed.email,
            parsed.password,
            parsed.username,
            parsed.lastName,
            parsed.firstName
          )
        ),
        // Deleting the verification token from Redis
        await redis.del(`verif:${suppliedToken}`),
      ]);

      // TODO: This part should be updated

      const refresh_token = createJwt({}, { expiresIn: "30d" });
      const access_token = createJwt({ id: user?.id }, { expiresIn: "2d" });

      return res.status(201).json({
        access_token,
        refresh_token,
        token_type: "Bearer",
        expires_in: 1000 * 60 ** 2 * 24 * 2,
      });
    } else return res.sendStatus(401);
  } else return res.sendStatus(401);
};

export default verify;
