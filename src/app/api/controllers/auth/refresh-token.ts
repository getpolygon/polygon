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
import { logger } from "@container";
import { createJwt, verifyJwt } from "@lib/jwt";
import type { Handler, Request } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { AuthResponse } from "./common/AuthResponse";

const handler: Handler = async (req: Request, res) => {
  const suppliedRefreshToken = req.headers["X-Refresh-Token"] as string;
  if (!suppliedRefreshToken) return res.sendStatus(401);
  else {
    try {
      const { id } = verifyJwt<{ id: string }>(suppliedRefreshToken);
      const accessToken = createJwt({ id }, { expiresIn: "2d" });
      const refreshToken = createJwt({ id }, { expiresIn: "30d" });
      const response = new AuthResponse({ accessToken, refreshToken });
      return res.json(response);
    } catch (error) {
      if (error instanceof JsonWebTokenError) return res.sendStatus(401);
      else {
        logger.error(error);
        return res.sendStatus(500);
      }
    }
  }
};

export default handler;
