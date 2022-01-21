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
import redis from "@db/redis";
import { isNil } from "lodash";
import { userDao } from "@container";
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "@lib/jwt";
import type { Payload } from "./register";
import { User } from "@dao/entities/User";
import type { Request, Response } from "express";

const handler = async (req: Request, res: Response) => {
  const { token: suppliedToken } = req.params;
  const { password: suppliedPassword } = req.body;

  // Getting the verification token from Redis
  const redisPayload = await redis.get(`verif:${suppliedToken}`);

  if (!isNil(redisPayload)) {
    const parsed = JSON.parse(
      Buffer.from(redisPayload, "base64").toString()
    ) as Payload;

    const correctPassword = await bcrypt.verify(
      suppliedPassword,
      parsed.password
    );

    if (correctPassword) {
      const [user] = await Promise.all([
        // Creating a user
        userDao.createUser(
          new User(
            parsed.email,
            parsed.password,
            parsed.username,
            parsed.lastName,
            parsed.firstName
          )
        ),
        // Deleting the verification token from Redis
        redis.del(`verif:${suppliedToken}`),
      ]);

      // TODO: This part should be updated
      const accessToken = createJwt({ id: user?.id }, { expiresIn: "2d" });
      const refreshToken = createJwt({ id: user?.id }, { expiresIn: "30d" });

      return res.status(201).json({
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: 1000 * 60 ** 2 * 24 * 2,
      });
    } else return res.sendStatus(401);
  } else return res.sendStatus(401);
};

export default handler;
