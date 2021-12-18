import bcrypt from "bcrypt";
import redis from "db/redis";
import { createJwt } from "util/jwt";
import type { Request, Response } from "express";
// import { userRepository } from "../../../db/dao";

const verify = async (req: Request, res: Response) => {
  const { token: suppliedToken } = req.params;
  const { password: suppliedPassword } = req.body;

  try {
    // prettier-ignore
    const redisPayload = await redis.get(suppliedToken) as string;
    // prettier-ignore
    const { 
      // email,
       password,
        // username,
        //  lastName, firstName 
        } = JSON.parse(redisPayload);
    // Checking passwords
    const same = bcrypt.compareSync(suppliedPassword, password);

    // Passwords match
    if (same) {
      const user = {} as any;
      throw new Error("Method not implemented.");
      // const user = await userRepository.create(
      //   ["email", "password", "username", "last_name", "first_name"],
      //   [email, password, username, lastName, firstName]
      // );

      await redis.del(suppliedToken);
      const token = createJwt({ id: user?.id });

      return res.status(201).json({ ...user, token });
    } else return res.sendStatus(401);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default verify;
