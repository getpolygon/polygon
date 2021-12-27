import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import routes from "routes/index";
import { errors } from "celebrate";
import compression from "compression";

// Create the express app. We will use this app to create the server.
const app = express();

// Configure the app to use helmet. This will help us secure our app.
// Helmet is a collection of tools for securing Express apps. It is
// designed to protect against well known web vulnerabilities.
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Middleware for development purposes. This will log all requests to the console.
// This is useful for debugging. It is not recommended to use this in production.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount the routes to the app.
app.use(routes);

// `celebrate` error handling middleware. Will return JSON response
// with invalid fields instead of HTML. The error middleware should
// invoke after a route is executed.
app.use(errors({ statusCode: 400 }));

export default app;
