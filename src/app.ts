import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import express from "express";
import compression from "compression";
// import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: true, credentials: true }));

app.use(routes);

export default app;
