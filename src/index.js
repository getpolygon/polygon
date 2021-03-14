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
	NODE_ENV
} = process.env;

const path = require("path");
const cors = require("cors");
const chalk = require("chalk");
const crypto = require("crypto");
const app = require("express")();
const helmet = require("helmet");
const { Policy } = require("minio");
const minio = require("./db/minio");
const redis = require("./db/redis");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");

// Routes
const routes = require("./routes/routes");
const __DEV__ = NODE_ENV === "development";

// Middleware
app.use(
	compression({
		level: 9
	})
);
app.use(helmet.noSniff());
app.use(bodyParser.json());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(crypto.randomBytes(30).toString("hex")));

// Use the routes
app.use("/", routes);
app.get("*", (req, res) => {
	return res.status(404).json({
		error: "Something's not right",
		path: req.originalUrl
	});
});

// Connect to MongoDB
mongoose
	.connect(MONGO_URI, {
		user: MONGO_USER,
		pass: MONGO_PASS,
		dbName: MONGO_CLUSTER,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
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
		console.log(chalk.redBright("There was an error while conecting to MongoDB"));
		console.error(error);
	});

// Connect to redis
redis.once("connect", () =>
	console.log(
		`${
			__DEV__ ? chalk.greenBright("Connected to Redis") : chalk.blueBright("Connected to Redis")
		} at ${chalk.bold(`redis://${REDIS_HOST}:${REDIS_PORT}/`)} 🔑`
	)
);

redis.once("error", (error) => {
	console.log(chalk.redBright("There was an error while connecting to Redis"));
	console.error(error);
});

minio.client.bucketExists("heartbeat", (error, _result) => {
	if (error) {
		console.log(chalk.redBright("There was an error while trying to connect to MinIO"));
	} else {
		minio.client.setBucketPolicy(minio.bucket, JSON.stringify(minio.policy));
		console.log(
			`${chalk.greenBright("Connected to MinIO")} at ${chalk.bold(
				`http://${MINIO_ENDPOINT}:${MINIO_PORT}/`
			)} 📷`
		);
	}
});

if (__DEV__) {
	const fs = require("fs");
	const https = require("https");

	// Development server with SSL
	const httpsServer = https.createServer(
		{
			key: fs.readFileSync(path.resolve("cert/key.pem")),
			cert: fs.readFileSync(path.resolve("cert/cert.pem"))
		},
		app
	);

	httpsServer.listen(port, "0.0.0.0", () => {
		console.clear();
		console.log(
			`${chalk.greenBright("Development server")} started at ${chalk.bold(
				`https://localhost:${port}/`
			)} 🚀`
		);
	});
} else {
	// Start the server
	app.listen(port, "0.0.0.0", () => {
		console.clear();
		console.log(`${chalk.blueBright("Production server")} started at port ${chalk.bold(port)} 🚀`);
	});
}
