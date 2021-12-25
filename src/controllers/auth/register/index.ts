import crypto from "crypto";
import bcrypt from "bcrypt";
import redis from "db/redis";
import config from "config/index";
import { userDao } from "container";
import { createJwt } from "util/jwt";
import { send } from "services/mailer";
import { isEqual, isNil } from "lodash";
import { User } from "dao/entities/User";
import { itOrError } from "lib/itOrError";
import type { Request, Response } from "express";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
import { PartialConfigError } from "lib/PartialConfigError";
import { DuplicateRecordError } from "dao/errors/DuplicateRecordError";

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  // If email verification is disabled
  if (
    isNil(config.polygon?.emailEnableVerification) ||
    isEqual(config.polygon?.emailEnableVerification, false)
  ) {
    try {
      // Creating a user
      const user = await userDao.createUser(
        new User(email, encryptedPassword, username, lastName, firstName)
      );
      const token = createJwt({ id: user?.id });

      return res.status(201).json({ token });
    } catch (error) {
      if (error instanceof DuplicateRecordError) return res.sendStatus(403);
      else {
        console.error(error);
        return res.sendStatus(500);
      }
    }
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

      // Sending an email with courier with the specified `VERIFICATION` event ID.
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
