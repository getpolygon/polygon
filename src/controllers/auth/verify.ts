import bcrypt from "bcrypt";
import express from "express";
import redis from "../../db/redis";
import getFirst from "../../utils/getFirst";
import { createJwt } from "../../utils/jwt";
import type { User } from "../../types/user";

const verify = (req: express.Request, res: express.Response) => {
  // Getting the token
  const { sid } = req.params;
  const { password } = req.body;

  redis.get(sid, async (error, value) => {
    if (error) return res.status(500).json();
    else {
      // If the verification token has expired
      if (!value) return res.status(404).json();
      else {
        const redisPayload = JSON.parse(value);
        const same = bcrypt.compareSync(password, redisPayload.password);

        // If passwords match
        if (same) {
          const user = await getFirst<Partial<User>>(
            `
            INSERT INTO users (
              email, 
              password, 
              username,
              last_name, 
              first_name
            ) VALUES ($1, $2, $3, $4, $5)

            RETURNING 
              id,
              bio,
              cover,
              avatar,
              username,
              last_name,
              first_name;
            `,
            [
              redisPayload.email,
              redisPayload.password,
              redisPayload.username,
              redisPayload.lastName,
              redisPayload.firstName,
            ]
          );

          const tokenPayload = { id: user?.id };
          const token = createJwt(tokenPayload);

          redis.del(sid, () => {
            return res
              .status(201)
              .cookie("jwt", token!!, {
                secure: true,
                signed: true,
                httpOnly: true,
                sameSite: "none",
              })
              .json(user);
          });
        } else return res.status(401).json();
      }
    }
  });
};

export default verify;
