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
import type { Handler } from "express";
import { send } from "@services/mailer";
import { logger, userDao } from "@container";

const handler: Handler = async (req, res) => {
  const { email } = req.body;
  const user = await userDao.getUserByEmail(email);

  if (isNil(user)) return res.sendStatus(422);
  else {
    const payload = JSON.stringify({ email });
    const token = crypto.randomBytes(12).toString("hex");

    try {
      const now = new Date();

      await Promise.all([
        redis.set(`reset:${token}`, payload),
        redis.expire(`reset:${token}`, config.email.expireVerification),
        send(
          email,
          new Pair("reset-password", config.courier.events["reset-password"]!),
          {
            token,
            date: now,
            to: user.email,
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
      return res.sendStatus(500);
    }
  }
};

export default handler;
