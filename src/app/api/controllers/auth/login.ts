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
import bcrypt from "@node-rs/bcrypt";
import { createJwt } from "@lib/jwt";
import type { User } from "@dao/entities/User";
import type { Request, Response } from "express";
import { APIAuthResponse } from "@app/api/common/APIAuthResponse";
import { APIErrorResponse } from "@app/api/common/APIErrorResponse";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await pg.getFirst<Partial<User>>(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  if (user !== null) {
    const correctPassword = await bcrypt.verify(password, user?.password!);
    if (correctPassword) {
      const accessToken = createJwt({ id: user.id }, { expiresIn: "2d" });
      const refreshToken = createJwt({ id: user.id }, { expiresIn: "30d" });
      return new APIAuthResponse(res, { data: { accessToken, refreshToken } });
    } else {
      return new APIErrorResponse(res, {
        status: 403,
        data: { message: "Passwords do not match" },
      });
    }
  } else {
    return new APIErrorResponse(res, {
      status: 401,
      data: { message: "User does not exist" },
    });
  }
};

export default login;
