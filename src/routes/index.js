const passport = require("passport");
const router = require("express").Router();
const NotFoundRoute = require("./misc/404");
const APIRoutes = require("./api/routes/index");
const AuthRoutes = require("./auth/routes/index");

// Auth
router.use("/auth", AuthRoutes);
// API
router.use("/api", passport.authenticate("jwt"), APIRoutes);
// 404
router.use(NotFoundRoute);

module.exports = router;
