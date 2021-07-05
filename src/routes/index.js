const router = require("express").Router();
const APIRoutes = require("./api/routes/index");
const AuthRoutes = require("./auth/routes/index");
const NotFoundRoute = require("./misc/404").default;
const authenticate = require("../middleware/authenticate").default;

// API
router.use("/api", authenticate(), APIRoutes);
// Auth
router.use("/auth", authenticate(true), AuthRoutes);
// 404
router.use(NotFoundRoute);

module.exports = router;
