import bcrypt from "bcrypt";
import { sql } from "slonik";
import express from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import redis from "../../db/redis";
import handlebars from "handlebars";
import slonik from "../../db/slonik";
const { BASE_FRONTEND_URL } = process.env;
import readTemplate from "../../utils/readTemplate";
import { send as SendMail } from "../../helpers/mailer";

const { JWT_PRIVATE_KEY, SALT_ROUNDS } = process.env;

// Will be used for temporary registration
export const register = async (req: express.Request, res: express.Response) => {
  // Reading the template
  const template = readTemplate("verification.html");
  // Getting the IP from the request
  const { ip } = req;
  // Generating a random id
  const sid = nanoid(100);
  // Getting the properties from the body
  const { firstName, lastName, email, password, username } = req.body;

  // Rendering the email template
  const rendered = handlebars.compile(template)({
    ip,
    token: sid,
    name: firstName,
    time: new Date(),
    frontendUrl: BASE_FRONTEND_URL,
  });

  // Sending an email for verification
  SendMail({
    html: rendered,
    receiver: email,
    subject: "Polygon email verification",
  });

  // Creating a payload
  const payload = {
    email,
    username,
    lastName,
    firstName,
    password: bcrypt.hashSync(password, parseInt(SALT_ROUNDS!!)),
  };

  // Setting a random key with initial, stringified values
  redis.set(sid, JSON.stringify(payload), (error, _) => {
    // Sending an error on error
    if (error) return res.status(500).json();
    else {
      // Set an expiration date on the key
      redis.expire(sid, 60 * 5, (error, _) => {
        // Sending an error on error
        if (error) return res.status(500).json();
        // Sending a "No Content" response on success
        else return res.status(204).json();
      });
    }
  });
};

// Will be used to verify temporary registration request
export const verify = (req: express.Request, res: express.Response) => {
  // Getting the token
  const { sid } = req.params;
  // Getting the password
  const { password } = req.body;

  // Getting the token
  redis.get(sid, async (error, value) => {
    // If there was an error
    if (error) return res.status(500).json();
    else {
      // If there's no such key
      if (!value) return res.status(404).json();
      else {
        // Parsing the stringified payload
        const payload = JSON.parse(value);
        // Comparing the passwords
        const same = bcrypt.compareSync(password, payload.password);

        // If passwords match
        if (same) {
          const {
            rows: { 0: user },
          } = await slonik.query(sql`
            INSERT INTO users (
              email, 
              password, 
              username,
              last_name, 
              first_name
            )

            VALUES (
              ${payload.email},
              ${payload.password},
              ${payload.username},
              ${payload.lastName},
              ${payload.firstName}
            )

            RETURNING 
              id,
              bio,
              cover,
              avatar,
              username,
              last_name,
              first_name;
          `);

          jwt.sign(
            { id: user.id },
            JWT_PRIVATE_KEY!!,
            {
              expiresIn: "7 days",
            },
            (error, token) => {
              if (error) console.error(error);
              else {
                // Deleting the sid from Redis
                redis.del(sid, (error, _) => {
                  if (error) console.error(error);
                  else {
                    // Sending a token as a response
                    return res
                      .status(201)
                      .cookie("jwt", token!!, {
                        secure: true,
                        signed: true,
                        httpOnly: true,
                        sameSite: "none",
                      })
                      .json(user);
                  }
                });
              }
            }
          );
        } else return res.status(401).json();
      }
    }
  });
};
