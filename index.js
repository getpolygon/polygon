// Packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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

app.use("/", platformRoute);
app.use("/auth", authRoute);

app.get("*", (req, res) => {
    res.render("error/error", { status: 404, err: "Not Found" })
});

mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to mongoDB
    .then(console.log("MongoDB Connection: OK"))
    .catch((e) => (console.log("MongoDB Connection: Error\n%s"), e));
app.listen(port, () => console.log(`Listening at port ${port}`)); // Start the server at ${port}
