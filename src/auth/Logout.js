const router = require("express").Router();
const LogoutController = require("../controllers/auth/Logout.controller");

// For logging out
router.post("/", LogoutController.logout);

module.exports = router;
