const router = require("express").Router();
// const expressRateLimit = require("express-rate-limit");

const APIRoutes = require("../api/routes/routes");
const AuthRoutes = require("../auth/routes/routes");

// API
router.use("/api", APIRoutes);
// Authentication
router.use("/auth", AuthRoutes);

module.exports = router;
