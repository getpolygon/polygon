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
import { add } from "date-fns";
import { Pair } from "@lib/Pair";
import { userDao } from "@container";
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "@lib/jwt";
import type { Handler } from "express";
import { send } from "@services/mailer";
import { User } from "@dao/entities/User";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIAuthResponse } from "@app/api/common/APIAuthResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";
import { DuplicateRecordException } from "@dao/errors/DuplicateRecordException";

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
export const registerWithoutVerification: Handler = async (req, res, next) => {
  try {
    const { firstName, lastName, password, username, email } = req.body;
    const user = new User(email, password, username, lastName, firstName);
    const { id } = (await userDao.createUser(user)) as { id: string };

    const accessToken = createJwt({ id }, { expiresIn: "2d" });
    const refreshToken = createJwt({ id }, { expiresIn: "30d" });

    return new APIAuthResponse(res, {
      status: 201,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    if (error instanceof DuplicateRecordException) {
      return new APIErrorResponse(res, {
        status: 409,
        data: { error: "User already exists" },
      });
    } else return next(error);
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
export const registerWithVerification: Handler = async (req, res, next) => {
  const { firstName, lastName, password, username, email } = req.body;

  // Checking if the user with the provided credentials already exists
  const existingUser = await userDao.getUserByEmail(email);
  if (existingUser !== null) {
    return new APIErrorResponse(res, {
      status: 409,
      data: { error: "User already exists" },
    });
  }

  try {
    const now = new Date();
    const payload: Payload = {
      email,
      lastName,
      username,
      firstName,
      password: await bcrypt.hash(password),
    };

    const token = ["verif", crypto.randomBytes(12).toString("hex")];

    /**
     * Temporarily persisting the token in Redis. Then,
     * wait until the email is sent. If there is an error,
     * return `500`.
     */
    await Promise.all([
      redis.set(
        token.join(":"),
        Buffer.from(JSON.stringify(payload)).toString("base64")
      ),
      redis.expire(token.join(":"), config.email.expireVerification),
      send(
        email,
        // Select the email template
        new Pair("email-verification", config.courier.events.verification!),
        {
          email,
          firstName,
          date: now,
          token: token[1],
          frontend: config.polygon.ui,
          // prettier-ignore
          expires: add(now, { seconds: config.email.expireVerification }).toUTCString(),
        }
      ),
    ]);

    return new APIResponse(res, { data: null, status: 204 });
  } catch (error) {
    return next(error);
  }
};
