// .env configuration
require("dotenv").config();

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const port = 3000 || process.env.PORT;
const app = express();

// Routes
const apiRoute = require("./routes/api");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const platformRoute = require("./routes/platform");
const userSettingsRoute = require("./routes/settings");

// Middleware
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));

app.set("views", "./views");
app.set("view engine", "ejs");

// Use the routes
app.use("/", platformRoute);
app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/settings", userSettingsRoute);

// Error page
app.get("*", (req, res) => res.redirect("/static/error.html"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("MongoDB: OK"))
    .catch(e => console.error(e));

// Start the server 
app.listen(port, () => console.log(`Server listening at port ${port}`));
