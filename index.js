require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const app = express();
const port = 3000 || process.env.PORT;
const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(compression());
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
const deletePostRoute = require("./api/deletePost");
const userSettingsRoute = require("./routes/settings");
const deleteAccountRoute = require("./api/deleteAccount");
const updateAccountRoute = require("./api/updateAccount");
const checkAccountRoute = require("./api//checkAccount");

app.use("/", platformRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/settings", userSettingsRoute);

app.use("/api", apiRoute);
app.use("/api/checkEmail", checkEmailRoute);
app.use("/api/createPost", createPostRoute);
app.use("/api/fetchPosts", fetchPostsRoute);
app.use("/api/deletePost", deletePostRoute);
app.use("/api/checkAccount", checkAccountRoute);
app.use("/api/deleteAccount", deleteAccountRoute);
app.use("/api/updateAccount", updateAccountRoute);

app.get("*", (_req, res) => {
    res.redirect("/static/error.html");
});

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("connected", () => {
    console.log(`MongoDB Connection: OK, at ${process.env.MONGO_DB}`)
});
mongoose.connection.once("error", (e) => {
    console.log(`MongoDB Connection: Error\n${e}`);
});

app.listen(port, () => console.log(`Server listening at port ${port}`));
