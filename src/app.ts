import cors from "cors";
import helmet from "helmet";
import redis from "db/redis";
import express from "express";
import config from "config/index";
import routes from "routes/index";
import { errors } from "celebrate";
import compression from "compression";
import session from "express-session";
import { trace } from "middleware/trace";
import connectRedis from "connect-redis";
import { itOrError } from "lib/itOrError";
import { sessionSecret } from "config/env";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
import { PartialConfigError } from "lib/PartialConfigError";

// Create the express app. We will use this app to create the server.
const app = express();

// Initializing `connect-redis` to use with `express-session` middleware
const RedisSessionStore = connectRedis(session);
const sessionStore = new RedisSessionStore({
  client: redis as any,
  // Expire sessions after 3 days
  ttl: 3600 * 24 * 3,
});

// Configure the app to use helmet. This will help us secure our app.
// Helmet is a collection of tools for securing Express apps. It is
// designed to protect against well known web vulnerabilities.
app.use(helmet());
app.use(
  session({
    resave: false,
    cookie: {
      signed: true,
      httpOnly: true,
      sameSite: "lax",
    },
    name: "polygon.sid",
    store: sessionStore,
    saveUninitialized: true,
    secret: itOrError(
      itOrDefaultTo(sessionSecret!, config.session?.secret),
      new PartialConfigError("`session.secret`")
    ),
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Middleware for development purposes. This will log all requests to the console.
// This is useful for debugging. It is not recommended to use this in production.
if (process.env.NODE_ENV === "development") {
  app.use(trace());
}

// Mount the routes to the app.
app.use(routes);

// `celebrate` error handling middleware. Will return JSON response
// with invalid fields instead of HTML. The error middleware should
// invoke after a route is executed.
app.use(errors({ statusCode: 400 }));

export default app;
