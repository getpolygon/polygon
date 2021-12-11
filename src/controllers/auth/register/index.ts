import crypto from "crypto";
import bcrypt from "bcrypt";
import redis from "db/redis";
import config from "config/index";
import { createJwt } from "util/jwt";
import { send } from "services/mailer";
import { userRepository } from "db/dao";
import { isEqual, isNil } from "lodash";
import { itOrError } from "lib/itOrError";
import type { Request, Response } from "express";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
import { PartialConfigError } from "lib/PartialConfigError";

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  // If email verification is disabled
  if (
    isNil(config.polygon?.emailEnableVerification) ||
    isEqual(config.polygon?.emailEnableVerification, false)
  ) {
    // Creating a user
    const { id } = await userRepository.create(
      ["email", "password", "username", "last_name", "first_name"],
      [email, encryptedPassword, username, lastName, firstName]
    );

    const token = createJwt({ id });
    return res.status(204).json({ token });
  } else {
    const token = crypto.randomBytes(12).toString("hex");
    // Creating a JSON payload with the specified information and converting it to a base64 string
    // prettier-ignore
    const payload = JSON.stringify({ email, username, lastName, firstName, password: encryptedPassword });
    const data = {
      email,
      token,
      firstName,
      // prettier-ignore
      frontendUrl: itOrError(config.polygon?.frontendUrl, new PartialConfigError("`polygon.frontendUrl`")),
    };

    // If the default email client was set to Courier
    if (isEqual(config.email?.client, "courier")) {
      const invalidCourierEvent = new Error(
        "`courier.events.VERIFICATION` event was not supplied in the `config.yaml` file."
      );

      // prettier-ignore
      await send(email, itOrError(config.courier?.events.VERIFICATION, invalidCourierEvent), data);
    } else await send(email, "email/verification", data);

    try {
      await redis.set(token, payload);
      await redis.expire(
        token,
        itOrDefaultTo(
          config.polygon?.emailExpireVerification,
          // 5 minutes
          60 * 5
        )
      );

      return res.sendStatus(204);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
};

export default register;
