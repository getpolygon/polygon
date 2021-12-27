import dotenv = require("dotenv");
dotenv.config();

// Required by `typedi`
import "reflect-metadata";

import app from "./app";
import http from "http";
import { port } from "config/env";
import { logger } from "container";

// Address to bind the server to.
const address = `http://127.0.0.1:${port}`;

// Create the server and start listening on the supplied port.
http
  .createServer(app)
  .listen(port, () => logger.info(`Server started at ${address}`));
