import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import morgan from "morgan";
import { isEqual } from "lodash";
import logger from "util/logger";
import { port } from "config/env";
import errorHandler from "errorhandler";

// Applying development middleware
if (isEqual(process.env.NODE_ENV, "development")) {
  app.use(morgan("dev"));

  // For printing the full stacktrace
  app.use(errorHandler());
}

http
  .createServer(app)
  .listen(port, () => logger.info(`Backend started at port ${port}`));
