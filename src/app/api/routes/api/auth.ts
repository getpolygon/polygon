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
import { z } from "zod";
import config from "@config";
import express from "express";
import { zodiac } from "@middleware/zodiac";
import controllers from "@api/controllers/auth";
import { normalizeEmail } from "@middleware/normalizeEmail";

const router = express.Router();

const loginValidators = () => {
  return zodiac({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
  });
};

/**
 * This is the main endpoint for logging in to Polygon.
 * If the request is successful, the response body will
 * contain access and refresh tokens with the maxAge of
 * the access token. If the request fails the server will
 * respond with either `401`(user does not exist) or `403`
 * (passwords do not match).
 */
router.post(
  "/login",
  loginValidators(),
  normalizeEmail(["email"]),
  controllers.login
);

const registrationValidators = () => {
  return zodiac({
    body: z.object({
      lastName: z.string(),
      firstName: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      username: z.string().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
    }),
  });
};

/**
 * This is a dynamic registration endpoint, meaning that different
 * handlers will be executed depending on current configuration.
 */
router.post(
  "/register",
  registrationValidators(),
  normalizeEmail(["email"]),
  config.email.enableVerification
    ? controllers.register.registerWithVerification
    : controllers.register.registerWithoutVerification
);

/**
 * This is a dynamic verification endpoint. The state
 * of this endpoint can be configured from the configuration
 * file.
 */
if (config.email.enableVerification) {
  const registrationVerificationValidators = () => {
    return zodiac({
      body: z.object({
        password: z.string().min(8),
      }),
    });
  };

  /**
   * This is the verification endpoint and is enabled only when
   * email verification is enabled from the configuration. This
   * endpoint will attempt to verify the validity of the token
   * and will create a new account if the supplied password is
   * correct.
   */
  router.post(
    "/registration-verification/:token",
    registrationVerificationValidators(),
    controllers.register.registrationVerification
  );
}

/**
 * This is a dynamic endpoint and completely depends on the configuration.
 * This endpoint will only be enabled if an email client has been specified
 * with valid configuration.
 */
if (config.email.client !== "none") {
  const resetPasswordValidators = () => {
    return zodiac({
      body: z.object({
        email: z.string().email(),
      }),
    });
  };

  /**
   * This endpoint will attempt to send an email to the user
   * that forgot the password to their account. Afterwards the
   * user will need to verify their identity by passing the token
   * to another endpoint which will finalize the reset.
   */
  router.post(
    "/reset-password",
    normalizeEmail(["email"]),
    resetPasswordValidators(),
    controllers.password.resetPassword
  );

  const verifyResetPasswordValidators = () => {
    return zodiac({
      params: z.object({
        // 12 random bytes
        token: z.string().min(24).max(24),
      }),

      body: z.object({
        password: z.string().min(8),
      }),
    });
  };

  /**
   * This endpoint will be used for validating the tokens
   * sent from `reset-password` endpoint and updating user's
   * password. If the token doesn't exist the server will respond
   * with `403` (invalid token), otherwise it will respond with `201`
   * (successfully updated).
   */
  router.post(
    "/verify-reset-password/:token",
    verifyResetPasswordValidators(),
    controllers.password.verifyResetPassword
  );
}

/**
 * This is an endpoint for refreshing access tokens. If
 * the refresh token is expired, this endpoint will return
 * `401`․
 */
router.post("/refresh-token", controllers.refreshToken);

export default router;
