import cors from "cors";
import helmet from "helmet";
import redis from "db/redis";
import express from "express";
import routes from "routes/index";
import config from "config/index";
import celebrate from "celebrate";
import compression from "compression";
import session from "express-session";
import { trace } from "middleware/trace";
import connectRedis from "connect-redis";

// Create the express app. We will use this app to create the server.
const app = express();

// Initializing `connect-redis` to use with `express-session` middleware
const RedisSessionStore = connectRedis(session);
const sessionStore = new RedisSessionStore({ client: redis as any });

// Trust only the first proxy. This is important if the instance is
// hosted behind a load balancer (e.g. Heroku). See:
// https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

// CORS middleware to allow cross-origin requests.
// Should be placed before other middleware. See:
// https://expressjs.com/en/advanced/best-practice-security.html
app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    origin: [config.polygon.frontend].concat(...config.polygon.origins),
  })
);

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
      // 2 Days
      maxAge: new Date().getMilliseconds() + 1000 * 60 ** 2 * 48,
    },
    name: "polygon.sid",
    store: sessionStore,
    saveUninitialized: true,
    secret: config.session.secret,
  })
);
app.use(
  compression({
    level: 2,
    memLevel: 9,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(celebrate.errors({ statusCode: 400 }));

export default app;
