// `reflect-metadata` will allow us to use decorators.
// This is required by `typedi` for dependency injection.
import "reflect-metadata";

import app from "./app";
import http from "http";
import config from "@config";
import { logger } from "@container";

// Address to bind the server to.
const address = `http://127.0.0.1:${config.polygon.port}`;

// Create the server and start listening on the supplied port.
http.createServer(app).listen(config.polygon.port, () => {
  logger.info(`Server started at ${address}`);
});
