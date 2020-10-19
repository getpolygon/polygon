// Load .env config
require("dotenv").config();

// Packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// Connect to redis
const cache = require('express-redis-cache')({
    host: "localhost", port: 6379, auth_pass: process.env.redis_pass
});
const app = express();
const port = 3000 || process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

const apiRoute = require("./routes/api");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const platformRoute = require("./routes/platform");
const checkEmailRoute = require("./api/checkEmail");
const createPostRoute = require("./api/createPost");
const fetchPostsRoute = require("./api/fetchPosts");

app.use("/", platformRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.use("/api", apiRoute);
app.use("/api/checkEmail", checkEmailRoute);
app.use("/api/createPost", createPostRoute);
app.use("/api/fetchPosts", fetchPostsRoute);

// cache.route() -> Caching the error route to redis
app.get("*", cache.route(), (_req, res) => {
    res.redirect("/static/error.html");
});

// If redis connection ok
cache.once("connected", () => {
    console.log("Redis connection: OK, port: %s", 6379);
});
// If redis connection error
cache.once("error", (e) => {
    console.log("Redis Connection: Error\n%s", e);
});

// Connect to MongoDB
mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("MongoDB Connection: OK"))
    .catch((e) => (console.log("MongoDB Connection: Error\n%s"), e));

// Start the server at ${port}
app.listen(port, () => console.log(`Server listening at port ${port}`));
