const router = require("express").Router();
const NotFoundRoute = require("./misc/404");
const APIRoutes = require("./api/routes/index");
const AuthRoutes = require("./auth/routes/index");
const authenticate = require("../middleware/authenticate").default;

// Auth
router.use("/auth", AuthRoutes);
// API
router.use("/api", authenticate(), APIRoutes);
// 404
router.use(NotFoundRoute);

module.exports = router;
