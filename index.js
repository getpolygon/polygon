// Packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cache = require('express-redis-cache')({
    host: "localhost", port: 6379, auth_pass: process.env.redis_pass
});
const app = express(); // Create express server
const port = 3000 || process.env.PORT; // Define the ports

dotenv.config(); // Load .env config
app.use(bodyParser.json()); // Use body-parser to parse html
app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser to parse html
app.use(cookieParser());
app.use(express.static("./public")); // Express Static
app.set("view engine", "ejs"); // EJS
app.set("views", "./views"); // Default view folder

let authRoute = require("./routes/auth");
let platformRoute = require("./routes/platform");
let usersRoute = require("./routes/users");

app.use("/", platformRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.get("*", /*Caching error route to redis*/ cache.route(), (_req, res) => {
    res.redirect("/static/error.html");
});

cache.once("connected", () => {  // Check redis connection (OK)
    console.log("Redis connection: OK, port: %s", 6379);
});
cache.once("error", (e) => { // redis connection on error
    console.log("Redis Connection: Error\n%s", e);
});
mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to mongoDB
    .then(console.log("MongoDB Connection: OK"))
    .catch((e) => (console.log("MongoDB Connection: Error\n%s"), e));

app.listen(port, () => console.log(`Server listening at port ${port}`)); // Start the server at ${port}
