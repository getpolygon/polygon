import bcrypt from "bcrypt";
import express from "express";
import redis from "../../../db/redis";
import getFirst from "../../../util/getFirst";
import { createJwt } from "../../../util/jwt";
import type { User } from "../../../types/user";

const verify = (req: express.Request, res: express.Response) => {
  // Getting the token
  const { token } = req.params;
  const { password } = req.body;

  redis.get(token, async (error, __payload) => {
    if (error) console.error(error);

    // If the verification token has expired or does not exist
    if (!__payload) return res.sendStatus(404);

    // Converting the base64 string to an object
    const payload = JSON.parse(__payload);
    // Checking if the passwords are the same
    const same = bcrypt.compareSync(password, payload.password);

    // Passwords match
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
          payload.email,
          payload.password,
          payload.username,
          payload.lastName,
          payload.firstName,
        ]
      );

      // Creating a JWT
      const token = createJwt({ id: user?.id });

      // Deleting the verification token from Redis
      redis.del(token, (error, _) => {
        if (error) console.error(error);

        return (
          res
            .status(201)
            // .cookie("jwt", token, {
            //   secure: true,
            //   signed: true,
            //   httpOnly: true,
            //   sameSite: "none",
            // })
            .json({ ...user, token })
        );
      });
    }

    // Passwords do not match
    return res.sendStatus(401);
  });
};

export default verify;
