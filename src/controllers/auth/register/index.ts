import crypto from "crypto";
import bcrypt from "bcrypt";
import config from "../../../config";
import redis from "../../../db/redis";
import { createJwt } from "../../../util/jwt";
import getFirst from "../../../util/getFirst";
import type { Request, Response } from "express";
import Mailer, { EmailTemplate } from "../../../services/mailer";

// TODO: Handle fallback values if they are not specified in the config file
const frontendUrl = config.frontend_url;
const enableVerification = config.polygon?.email.enable_verification;
const expireVerification = config.polygon?.email.expire_verification || 60 * 5;

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;

  // Encrypting the password
  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  if (!enableVerification) {
    // Creating a user
    const { id } = await getFirst<{ id: string }>(
      `
        INSERT INTO users (
          email, 
          password, 
          username,
          last_name, 
          first_name
        ) VALUES ($1, $2, $3, $4, $5)

        RETURNING id;
        `,
      [email, encryptedPassword, username, lastName, firstName]
    );

    // Creating a token
    const token = createJwt({ id });
    return res.status(204).json({ token });
  } else {
    // Creating a random verification request identifier
    const token = crypto.randomBytes(12).toString("hex");
    // Creating a JSON payload with the specified information and converting it to a base64 string
    const payload = JSON.stringify({
      email,
      username,
      lastName,
      firstName,
      password: encryptedPassword,
    });

    // Sending an email
    await Mailer.send({
      recipient: email,
      nodemailer: {
        template: EmailTemplate.Verification,
      },
      courier: {
        brandId: config.email?.courier.brandId!!,
        eventId: config.email?.courier.events.verification!!,
      },
      data: {
        email,
        token,
        firstName,
        frontendUrl,
      },
    });

    // Setting a token
    redis.set(token, payload, (error, _) => {
      if (error) return res.sendStatus(500);

      // Setting an expiration time on the key
      redis.expire(token, expireVerification, (error, _) => {
        if (error) return res.sendStatus(500);
        return res.sendStatus(204);
      });
    });
  }
};

export default register;
