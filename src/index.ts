require("dotenv").config();

import http from "http";
import cors from "cors";
// import csurf from "csurf";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import express from "express";
import minio from "./db/minio";
import slonik from "./db/slonik";
import initDB from "./utils/initDB";
import compression from "compression";
import cookieParser from "cookie-parser";
const PORT = Number(process.env.PORT) || 3001;
const __DEV__ = process.env.NODE_ENV === "development";
const origins = __DEV__ ? true : JSON.parse(process.env.ORIGINS!!) || null;

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
__DEV__ && app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: origins, credentials: true }));

// Use the routes
app.use(routes);

// Initialize database connection
slonik.connect(async (connection) => await initDB(connection));

minio.client.bucketExists(minio.config.MINIO_BUCKET!!, (error, exists) => {
  if (error) throw error;
  else {
    if (!exists) minio.client.makeBucket(minio.config.MINIO_BUCKET!!, "am_EVN");
  }
});

// For development environment
if (__DEV__) {
  const httpServer = http.createServer(app);

  // Start the server
  httpServer.listen(PORT, "0.0.0.0", () => {
    // Clear the console
    console.clear();
    console.log(
      `${chalk.greenBright("Started development server")} at ${chalk.bold(
        `http://localhost:${PORT}/`
      )}`
    );
  });
}
// For production environment
else {
  const http = require("http");
  const server = http.createServer(app);

  server.listen(PORT, "0.0.0.0", () => {
    console.clear();
    console.log(
      `${chalk.greenBright("Started production server")} at port ${chalk.bold(
        PORT
      )}`
    );
  });
}
