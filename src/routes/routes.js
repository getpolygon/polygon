const router = require("express").Router();

const APIRoutes = require("../api/routes/routes");
const AuthRoutes = require("../auth/routes/routes");

// API
router.use("/api", APIRoutes);
// Authentication
router.use("/auth", AuthRoutes);

module.exports = router;
