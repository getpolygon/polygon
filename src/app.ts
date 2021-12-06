import cors from "cors";
import helmet from "helmet";
import express from "express";
import routes from "routes/index";
import compression from "compression";

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(routes);

export default app;
