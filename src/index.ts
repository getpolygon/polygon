require("dotenv").config();

import http from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import express from "express";
import minio from "./db/minio";
import compression from "compression";
import cookieParser from "cookie-parser";

// Setting the port
const port = Number(process.env.PORT) || 3001;
// Development mode
const __DEV__ = process.env.NODE_ENV === "development";
// Allowing only certain origins in production
const origins = __DEV__ ? true : JSON.parse(process.env.ORIGINS!!) || false;

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
__DEV__ && app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: origins, credentials: true }));

// Initialize the routes
app.use(routes);

// Creating a bucket if it doesn't exist
minio.client.bucketExists(minio.config.MINIO_BUCKET!!, (error, exists) => {
  if (error) throw error;
  else {
    if (!exists) minio.client.makeBucket(minio.config.MINIO_BUCKET!!, "am_EVN");
  }
});

// Creating an HTTP server
const httpServer = http.createServer(app);

// Start the server
httpServer.listen(port, () => console.log(`> Backend started at port ${port}`));
