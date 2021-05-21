const router = require("express").Router();
const APIRoutes = require("./api/routes/index");
const AuthRoutes = require("./auth/routes/index");

// API
router.use("/api", APIRoutes);
// Authentication
router.use("/auth", AuthRoutes);

module.exports = router;
