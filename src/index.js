"use strict";
require("dotenv").config();
const {
  MONGO_URI,
  MONGO_USER,
  MONGO_PASS,
  MONGO_CLUSTER,
  REDIS_HOST,
  REDIS_PORT,
  MINIO_ENDPOINT,
  MINIO_PORT,
  NODE_ENV,
  COOKIE_SECRET,
} = process.env;

const path = require("path");
const cors = require("cors");
const chalk = require("chalk");
const crypto = require("crypto");
const app = require("express")();
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const express = require("express");
const minio = require("./db/minio");
const redis = require("./db/redis");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const compression = require("compression");
const __DEV__ = NODE_ENV === "development";
const cookieParser = require("cookie-parser");

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
__DEV__ && app.use(morgan("dev"));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Use the routes
app.use(routes);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    user: MONGO_USER,
    pass: MONGO_PASS,
    dbName: MONGO_CLUSTER,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      `${
        __DEV__
          ? chalk.greenBright("Connected to MongoDB")
          : chalk.blueBright("Connected to MongoDB")
      } at ${chalk.bold(MONGO_URI)} 🍃`
    );
  })
  .catch((error) => {
    console.log(
      chalk.redBright("There was an error while conecting to MongoDB")
    );
    console.error(error);
  });

// Connect to redis
redis.once("connect", () =>
  console.log(
    `${
      __DEV__
        ? chalk.greenBright("Connected to Redis")
        : chalk.blueBright("Connected to Redis")
    } at ${chalk.bold(`redis://${REDIS_HOST}:${REDIS_PORT}/`)} 🔑`
  )
);
// On redis connection error
redis.once("error", (error) => {
  console.log(chalk.redBright("There was an error while connecting to Redis"));
  console.error(error);
});

// Checking MinIO connection
minio.client.bucketExists("heartbeat", (error, _result) => {
  if (error)
    console.log(
      chalk.redBright("There was an error while trying to connect to MinIO")
    );
  else {
    // minio.client.setBucketPolicy(minio.bucket, JSON.stringify(minio.policy));
    console.log(
      `${chalk.greenBright("Connected to MinIO")} at ${chalk.bold(
        `http://${MINIO_ENDPOINT}:${MINIO_PORT}/`
      )} 📷`
    );
  }
});

// For development environment
if (__DEV__) {
  const fs = require("fs");
  const https = require("https");

  // Development server with SSL
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(path.resolve("cert/key.pem")),
      cert: fs.readFileSync(path.resolve("cert/cert.pem")),
    },
    app
  );

  // HTTPS Server (NO HTTP)
  httpsServer.listen(PORT, "0.0.0.0", () => {
    console.clear();
    console.log(
      `${chalk.greenBright("HTTPS server")} started at ${chalk.bold(
        `https://localhost:${PORT}/`
      )} 🚀`
    );
  });
}
// For production environment
else {
  // Start the server
  app.listen(PORT, "0.0.0.0", () => {
    console.clear();
    console.log(
      `${chalk.blueBright("Production server")} started at port ${chalk.bold(
        PORT
      )} 🚀`
    );
  });
}
