// Packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport"); 
const app = express(); // Create express server
const port = 3000 || process.env.PORT; // Define the ports

dotenv.config(); // Load .env config
app.use(bodyParser.json()); // Use body-parser to parse html
app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser to parse html
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // Express Session
app.use(express.static("./public")); // Express Static
app.use(passport.initialize()); // Passport JS
app.use(passport.session()); // Passport JS
app.set("view engine", "ejs"); // EJS
app.set("views", "./views"); // Default view folder

let authRoute = require("./routes/auth");
let platformRoute = require("./routes/platform");

app.use("/", authRoute);
app.use("/platform", platformRoute);

mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to mongoDB
    .then(console.log("MongoDB Connection: OK"))
    .catch((e) => (console.log("MongoDB Connection: Error\n%s"), e));
app.listen(port, () => console.log(`Listening at port ${port}`)); // Start the server at ${port}
