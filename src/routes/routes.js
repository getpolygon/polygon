const router = require("express").Router();
// const expressRateLimit = require("express-rate-limit");

const APIRoutes = require("../api/routes/routes");
const AuthRoutes = require("../auth/routes/routes");

// API
router.use(
	"/api",
	// expressRateLimit({
	// 	windowMs: 6 * 1000,
	// 	max: 100
	// }),
	APIRoutes
);
// Authentication
router.use(
	"/auth",
	// expressRateLimit({
	// 	windowMs: 20 * 1000
	// }),
	AuthRoutes
);

module.exports = router;
