import crypto from "crypto";
import redis from "db/redis";
import config from "config/index";
import { userDao } from "container";
import { createJwt } from "util/jwt";
import bcrypt from "@node-rs/bcrypt";
import { send } from "services/mailer";
import { isEqual, isNil } from "lodash";
import { User } from "dao/entities/User";
import { itOrError } from "lib/itOrError";
import type { Request, Response } from "express";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
import { PartialConfigError } from "lib/PartialConfigError";
import { DuplicateRecordError } from "dao/errors/DuplicateRecordError";

const verificationEnabled = itOrDefaultTo(
  config.polygon?.emailEnableVerification,
  false
);

// Default expiration time for temporary verification tokens
const expiryTime = itOrDefaultTo(
  config.polygon?.emailExpireVerification,
  // 5 minutes
  60 * 5
);

// Default verification event for usage with Courier
// prettier-ignore
const verificationEvent = verificationEnabled && itOrError(
  config.courier?.events.VERIFICATION,
  new PartialConfigError("`courier.events.VERIFICATION`")
);

// Frontend URL that will be used for authentication
// prettier-ignore
const frontendUrl = verificationEnabled && itOrError(
  config.polygon?.frontendUrl,
  new PartialConfigError("`polygon.frontendUrl`")
);

/**
 * Temporary payload that will be deserialized from
 * Redis for finalizing user registration
 */
export type Payload = {
  email: string;
  password: string;
  lastName: string;
  username: string;
  firstName: string;
};

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, username } = req.body;
  const encryptedPassword = await bcrypt.hash(password);

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
      req.session.token = token;
      return res.status(201).json({ token });
    } catch (error) {
      if (error instanceof DuplicateRecordError) return res.sendStatus(403);
      else {
        console.error(error);
        return res.sendStatus(500);
      }
    }
  } else {
    const payload: Payload = { email, password, lastName, username, firstName };
    const token = crypto.randomBytes(12).toString("hex");
    const stringified = JSON.stringify(payload);

    // The event or the template that is going to be used while sending a verification email
    // prettier-ignore
    const eventOrTemplate = config.email?.client === "courier" ? verificationEvent : "email/verification";

    // Sending a verification email
    await send(email, eventOrTemplate, {
      email,
      token,
      firstName,
      frontendUrl,
    });

    await redis.set(`verif:${token}`, stringified);
    await redis.expire(`verif:${token}`, expiryTime);

    return res.sendStatus(204);
  }
};

export default register;
