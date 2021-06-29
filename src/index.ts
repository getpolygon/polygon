"use strict";
require("dotenv").config();
const PORT = Number(process.env.PORT) || 3001;
const __DEV__ = process.env.NODE_ENV === "development";

import path from "path";
import cors from "cors";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
__DEV__ && app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: true, credentials: true }));

// Use the routes
app.use(routes);

// For development environment
if (__DEV__) {
  const fs = require("fs");
  const https = require("https");

  //Development server with SSL
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(path.resolve("cert/key.pem")),
      cert: fs.readFileSync(path.resolve("cert/cert.pem")),
    },
    app
  );

  //Start the server
  httpsServer.listen(PORT, "0.0.0.0", () => {
    // Clear the console
    console.clear();
    console.log(
      `${chalk.greenBright(
        "Started secure development server"
      )} at ${chalk.bold(`https://localhost:${PORT}/`)}`
    );
  });
}
// For production environment
else {
  app.listen(PORT, "0.0.0.0", () => {
    console.clear();
    console.log(
      `${chalk.greenBright("Production server")} started at port ${chalk.bold(
        PORT
      )}`
    );
  });
}
