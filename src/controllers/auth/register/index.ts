import crypto from "crypto";
import bcrypt from "bcrypt";
import redis from "db/redis";
import config from "config/index";
import { createJwt } from "util/jwt";
import { userRepository } from "db/dao";
import type { Request, Response } from "express";
import Mailer, { EmailTemplate } from "services/mailer";

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  // If email verification is disabled
  if (!config.polygon?.emailEnableVerification) {
    // Creating a user
    const { id } = await userRepository.create(
      ["email", "password", "username", "last_name", "first_name"],
      [email, encryptedPassword, username, lastName, firstName]
    );

    const token = createJwt({ id });
    return res.status(204).json({ token });
  } else {
    const token = crypto.randomBytes(12).toString("hex");
    // prettier-ignore
    // Creating a JSON payload with the specified information and converting it to a base64 string
    const payload = JSON.stringify({ email, username, lastName, firstName, password: encryptedPassword });

    // Sending an email
    await Mailer.send({
      recipient: email,
      nodemailer: {
        template: EmailTemplate.Verification,
      },
      courier: {
        brandId: config.courier?.brandId!!,
        eventId: config.courier?.events.VERIFICATION!!,
      },
      data: {
        email,
        token,
        firstName,
        frontendUrl: config.polygon?.frontendUrl,
      },
    });

    try {
      await redis.set(token, payload);
      await redis.expire(token, config.polygon?.emailExpireVerification);

      return res.sendStatus(204);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
};

export default register;
