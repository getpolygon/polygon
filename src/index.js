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

const PORT = process.env.PORT || 3001;
const __DEV__ = NODE_ENV === "development";

const path = require("path");
const cors = require("cors");
const chalk = require("chalk");
const app = require("express")();
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const express = require("express");
const minio = require("./db/minio");
const redis = require("./db/redis");
const mongoose = require("mongoose");
const compression = require("compression");
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
    // autoCreate: true,
    useCreateIndex: true,
    dbName: MONGO_CLUSTER,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(
      `${chalk.greenBright("Connected to MongoDB")} at ${chalk.bold(MONGO_URI)}`
    )
  )
  .catch((error) => {
    console.log(
      chalk.redBright("There was an error while conecting to MongoDB")
    );
    throw new Error(error);
  });

// Connect to redis
redis.once("connect", () =>
  console.log(
    `${chalk.greenBright("Connected to Redis")} at ${chalk.bold(
      `redis://${REDIS_HOST}:${REDIS_PORT}/`
    )}`
  )
);

// On redis connection error
redis.once("error", (error) => {
  console.log(chalk.redBright("There was an error while connecting to Redis"));
  throw new Error(error);
});

// Checking MinIO connection
minio.client.bucketExists(minio.config.MINIO_BUCKET, (error, result) => {
  if (error) {
    console.log(
      chalk.redBright("There was an error while trying to connect to MinIO")
    );
    throw new Error(error);
  } else {
    if (!result) minio.client.makeBucket(minio.config.MINIO_BUCKET, "am");

    console.log(
      `${chalk.greenBright("Connected to MinIO")} at ${chalk.bold(
        `http://${MINIO_ENDPOINT}:${MINIO_PORT}/`
      )}`
    );
  }
});

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
        "Started secure development server "
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

// Commented out HTTP server code
// for testing reverse proxy connections
// app.listen(PORT, () => {
//   console.clear();
//   console.log(
//     `${chalk.greenBright("Started development server ")} at ${chalk.bold(
//       `https://localhost:${PORT}/`
//     )}`
//   );
// });
