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
import pg from "@db/pg";
import redis from "@db/redis";
import { isNil } from "lodash";
import bcrypt from "@node-rs/bcrypt";
import type { Handler } from "express";
import { APIResponse } from "@app/api/common/APIResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const handler: Handler = async (req, res, next) => {
  const { token: suppliedToken } = req.params;
  const { password: suppliedPassword } = req.body;

  // Checking if the token is valid
  const existingRecord = await redis.get(`reset:${suppliedToken}`);
  if (isNil(existingRecord)) {
    return new APIErrorResponse(res, {
      status: 401,
      data: {
        error: "Token does not exist or was expired",
      },
    });
  } else {
    try {
      const payload = JSON.parse(existingRecord);
      const hashedPassword = await bcrypt.hash(suppliedPassword);

      // Updating the password and removing the token from Redis
      await Promise.all([
        pg.query("UPDATE users SET password = $1 WHERE email = $2", [
          hashedPassword,
          payload.email,
        ]),
        redis.del(`reset:${suppliedToken}`),
      ]);

      return new APIResponse(res, { data: null, status: 201 });
    } catch (error) {
      return next(error);
    }
  }
};

export default handler;
