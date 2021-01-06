require("dotenv").config();
const { MONGO_URI, MONGO_USER, MONGO_PASS, MONGO_CLUSTER, EXPRESS_SECRET } = process.env;

// Dependencies
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3001;
const app = express();

// Routes
const apiRoute = require("./routes/api");
const authRoute = require("./routes/auth");
const platformRoute = require("./routes/platform");

// Middleware
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    cookie: {
      secure: false,
      httpOnly: false
    },
    secret: EXPRESS_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.set("views", "src/views/");
app.set("view engine", "ejs");

// Enable/Disable Headers
app.enable("trust proxy");
app.disable("x-powered-by");
app.enable("x-frame-options");
app.enable("x-content-type-options");

// Use the routes
app.use("/", platformRoute);
app.use("/api", apiRoute);
app.use("/auth", authRoute);

// Error page
app.get("*", (_req, res) => res.redirect("/static/error.html"));

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
