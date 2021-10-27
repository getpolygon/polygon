import crypto from "crypto";
import bcrypt from "bcrypt";
import express from "express";
import redis from "../../db/redis";
import courier, { config } from "../../utils/courier";

// Token expiration time
// Default: 5 minutes
const expireAfter =
  Number(process.env.POLYGON_EXPIRE_VERIFICATION_AFTER) || 60 * 5;

// Front-end token verification endpoint
// Default: http://localhost:3000/
const verificationUrl =
  process.env.POLYGON_EMAIL_VERIFICATION_URL || "http://localhost:3000/";

const register = async (req: express.Request, res: express.Response) => {
  // Generating a random token
  const token = crypto.randomBytes(12).toString("hex");
  const { firstName, lastName, email, password, username } = req.body;

  try {
    // Sending a verification email to the specified email address
    await courier.send({
      profile: {
        email,
      },
      data: {
        email,
        token,
        firstName,
        verificationUrl,
      },
      recipientId: email,
      eventId: config.events.verificationEventId!!,
      override: {
        smtp: {
          config: {
            auth: {
              user: config.smtp.user,
              pass: config.smtp.pass,
            },
            host: config.smtp.host,
            port: config.smtp.port,
            secure: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  // Creating a JSON payload with the specified information and converting it to a base64 string
  const payload = JSON.stringify({
    email,
    username,
    lastName,
    firstName,
    password: bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(Math.floor(Math.random()))
    ),
  });

  // Setting a token
  redis.set(token, payload, (error, _) => {
    if (error) return res.sendStatus(500);

    // Setting an expiration time on the key
    redis.expire(token, expireAfter, (error, _) => {
      if (error) return res.sendStatus(500);
      return res.sendStatus(204);
    });
  });
};

export default register;
