require("dotenv").config();

import app from "./app";
import http from "http";
import morgan from "morgan";
import logger from "./util/logger";
import errorHandler from "errorhandler";

// Port for Polygon to bind to
const port = process.env.PORT || process.env.POLYGON_PORT || 3001;

// Applying development middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // For printing the full stacktrace
  app.use(errorHandler());
}

http
  .createServer(app)
  .listen(port, () => logger.info(`Backend started at port ${port}`));
