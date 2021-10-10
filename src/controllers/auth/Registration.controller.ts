import bcrypt from "bcrypt";
import express from "express";
import redis from "../../db/redis";
import getFirst from "../../utils/getFirst";
import { createJwt } from "../../utils/jwt";
import type { User } from "../../types/user";

// const {
//   // JWT_PRIVATE_KEY,
//   // BASE_FRONTEND_URL,
//   NODE_ENV,
// } = process.env;
// const isDev = NODE_ENV === "development";

// Will be used for temporary registration
// TODO: Send an email with courier for verification
export const register = async (req: express.Request, res: express.Response) => {
  // Getting the properties from the body
  // const { firstName, lastName, email, password, username } = req.body;
  // // Rendering the email template
  // const rendered = handlebars.compile(template)({
  //   ip,
  //   token: sid,
  //   name: firstName,
  //   time: new Date(),
  //   frontendUrl: BASE_FRONTEND_URL,
  // });
  // // Sending an email for verification
  // const mail = new Mail({
  //   html: rendered,
  //   receiver: email,
  //   subject: "Polygon email verification",
  // });
  // await mail.send();
  // Creating a payload
  // const payload = {
  //   email,
  //   username,
  //   lastName,
  //   firstName,
  //   password: bcrypt.hashSync(
  //     password,
  //     bcrypt.genSaltSync(Math.floor(Math.random()))
  //   ),
  // };
  // // Setting a random key with initial, stringified values for email verification
  // redis.set(sid, JSON.stringify(payload), (error, _) => {
  //   if (error) return res.status(500).json();
  //   else {
  //     redis.expire(sid, 60 * 5, (error, _) => {
  //       if (error) return res.status(500).json();
  //       // Only sending the sid of the verification token in development
  //       else return res.status(204).json(isDev && sid);
  //     });
  //   }
  // });
};

// Will be used to verify temporary registration request
export const verify = (req: express.Request, res: express.Response) => {
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
