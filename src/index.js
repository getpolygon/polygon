require("dotenv").config();
const app = require("express")();
// WebSocket Support
require("express-ws")(app);
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const { MONGO_URI, MONGO_USER, MONGO_PASS, MONGO_CLUSTER, EXPRESS_SECRET } = process.env;
// Routes
const routes = require("./routes/routes");

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: EXPRESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection, dbName: "sessions" }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
);
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

// Use the routes
app.use("/", routes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: MONGO_CLUSTER,
  user: MONGO_USER,
  pass: MONGO_PASS
});

mongoose.connection.once("connected", () => {
  console.log("MongoDB connection established successfully");
});

// Start the server
app.listen(port, "0.0.0.0", () => console.log(`Server started at port ${port}`));
