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

import cors from "cors";
import helmet from "helmet";
import config from "@config";
import express from "express";
import routes from "@api/routes";
import { trace } from "@util/trace";
import compression from "compression";
import errorhandler from "errorhandler";
import { uncaughtErrorHandler } from "@app/api/middleware/uncaughtErrorHandler";

// Create the express app. We will use this app to create the server.
const app = express();

// Trust only the first proxy. This is important if the instance is
// hosted behind a load balancer (e.g. Heroku).
// See: https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

// CORS middleware to allow cross-origin requests.
// Should be placed before other middleware. See:
// https://expressjs.com/en/advanced/best-practice-security.html
app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    origin: config.polygon.ui
      ? [config.polygon.ui!].concat(config.polygon.origins)
      : config.polygon.origins,
  })
);

// Configure the app to use helmet. This will help us secure our app.
// Helmet is a collection of tools for securing Express apps. It is
// designed to protect against well known web vulnerabilities.
app.use(helmet());
app.use(
  compression({
    level: 2,
    memLevel: 9,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for development purposes. This will log all requests to the console.
// This is useful for debugging. It is not recommended to use this in production.
if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
  app.use(trace());
}

// Mount the routes to the app.
app.use(routes);

// Catchall route for errors
app.use(uncaughtErrorHandler());

export default app;
