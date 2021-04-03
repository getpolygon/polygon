const router = require("express").Router();
const LoginController = require("../controllers/auth/Login.controller");

// For logging in
router.post("/", LoginController.login);

module.exports = router;
