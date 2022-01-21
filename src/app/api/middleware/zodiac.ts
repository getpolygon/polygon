/**
 * Zodiac is a middleware for validating Express.js
 * requests using [zod](https://github.com/colinhacks/zod)
 * validation framework.
 */

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
import type { Handler } from "express";
import type { AnyZodObject } from "zod";

/**
 * Express.js request segments supported
 * by zodiac.
 */
export const enum Segments {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
  HEADERS = "headers",
}

/**
 * Parameters required by zodiac for request
 * validation.
 */
type IZodiac = {
  [segments in Segments]?: AnyZodObject;
};

/**
 * zodiac is a middleware for validating Express.js requests
 * with [zod](https://github.com/colinhacks/zod)
 *
 * @param segments - The segments of the request that will need to be validated.
 *
 * @example
 * ```ts
 * import { z } from "zod";
 * import http from "http";
 * import express from "express";
 * import { zodiac } from "zodiac";
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.get("/protected/:id", zodiac({
 *    headers: z.object({
 *      Authorization: z.string()
 *    }),
 *
 *    body: z.object({
 *      username: z.string()
 *    }),
 *
 *    query: z.object({
 *      client_id: z.optional(z.string())
 *    }).default({})
 *
 *    params: z.object({
 *      id: z.string().uuid()
 *    })
 * }), (req, res) => res.json(req.headers.authorization))
 *
 * http.createServer(app).listen(3000);
 * ```
 */
export const zodiac = (segments: IZodiac): Handler => {
  return async (req, res, next) => {
    try {
      if (segments.params)
        segments.params.parse(req.params, { path: ["params"] });
      if (segments.headers)
        segments.headers.parse(req.headers, { path: ["headers"] });
      if (segments.body) segments.body.parse(req.body, { path: ["body"] });
      if (segments.query) segments.query.parse(req.query, { path: ["query"] });

      return next(null);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
};
