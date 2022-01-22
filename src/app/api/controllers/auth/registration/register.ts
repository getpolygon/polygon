/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2021, Michael Grigoryan
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import crypto from "crypto";
import config from "@config";
import redis from "@db/redis";
import { isNil } from "lodash";
import { add } from "date-fns";
import { Pair } from "@lib/Pair";
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "@lib/jwt";
import { send } from "@services/mailer";
import { User } from "@dao/entities/User";
import { logger, userDao } from "@container";
import type { Request, Response } from "express";
import { DuplicateRecordException } from "@dao/errors/DuplicateRecordException";
import { AuthResponse } from "../common/AuthResponse";

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

/**
 * This registration controller will attempt to create a user without
 * the need of verifying user's email address.
 *
 * The endpoint will create the user directly without going through
 * the process of sending a verification email to the user and
 * temporarily persisting the payload in redis.
 */
export const registerWithoutVerification = async (
  req: Request,
  res: Response
) => {
  const { firstName, lastName, password, username, email } = req.body;

  try {
    const user = new User(email, password, username, lastName, firstName);
    const { id } = (await userDao.createUser(user)) as {
      [key: string]: unknown;
    };

    const accessToken = createJwt({ id }, { expiresIn: "2d" });
    const refreshToken = createJwt({ id }, { expiresIn: "30d" });

    const response = new AuthResponse({ accessToken, refreshToken });
    return res.status(201).json(response);
  } catch (error) {
    // If a user with similar credentials exists
    if (error instanceof DuplicateRecordException) return res.sendStatus(409);
    else {
      logger.error(error);
      return res.sendStatus(500);
    }
  }
};

/**
 * This is a registration controller for handling registration requests
 * when email verification is enabled from the configuration. This endpoint
 * will send an email to the user's email address and will not create a user
 * directly.
 *
 * The information will need to be verified by sending a `POST` request
 * to `/api/auth/registration-verification/:token` in order to finalize
 * the account creation process.
 */
export const registerWithVerification = async (req: Request, res: Response) => {
  const { firstName, lastName, password, username, email } = req.body;

  // Checking if a user already exists
  const existingUser = await userDao.getUserByEmail(email);
  if (!isNil(existingUser)) return res.sendStatus(409);

  const token = crypto.randomBytes(12).toString("hex");
  // This payload will be persisted in Redis
  const payload: Payload = {
    email,
    lastName,
    username,
    firstName,
    password: await bcrypt.hash(password),
  };

  try {
    const now = new Date();

    /**
     * Temporarily persisting the token in Redis. Then,
     * wait until the email is sent. If there is an error,
     * return `500`.
     */
    await Promise.all([
      redis.set(
        `verif:${token}`,
        Buffer.from(JSON.stringify(payload)).toString("base64")
      ),
      redis.expire(`verif:${token}`, config.email.expireVerification),
      send(
        email,
        new Pair("email-verification", config.courier.events.verification!),
        {
          email,
          token,
          firstName,
          date: now,
          frontend: config.polygon.frontend,
          expires: add(now, {
            seconds: config.email.expireVerification,
          }).toUTCString(),
        }
      ),
    ]);

    return res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    logger.warn(
      "..The error above might occur because of the current value of `smtp.secure` property in the configuration."
    );

    return res.sendStatus(500);
  }
};
