require("dotenv").config();

import http from "http";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import express from "express";
import logger from "./helpers/Logger";
import compression from "compression";
import cookieParser from "cookie-parser";
import checkEnv from "./helpers/checkEnv";

// Checking the presence of required environment variables
checkEnv();

const app = express();
const port = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV === "development";
const origins = isDev
  ? true
  : JSON.parse((process.env.ORIGINS as any) || null) || false;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: origins, credentials: true }));
isDev && app.use(morgan("dev"));

app.use(routes);

const httpServer = http.createServer(app);
httpServer.listen(port, () => logger.info(`Backend started at port ${port}`));
