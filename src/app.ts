import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import routes from "routes/index";
import { errors } from "celebrate";
import compression from "compression";

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(routes);

// `celebrate` error handling middleware. Will return JSON errors instead of HTML
// Do not move these middleware.
app.use(morgan("dev"));
// The error middleware should invoke after a route is executed
app.use(errors({ statusCode: 400 }));

export default app;
