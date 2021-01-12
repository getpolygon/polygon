const router = require("express").Router();

// Controllers
const LoginHandler = require("../auth/Login");
const RegistrationHandler = require("../auth/Register");
const TokenVerificationHandler = require("../auth/Verify");

router.use("/login", LoginHandler);
router.use("/register", RegistrationHandler);
router.use("/verify", TokenVerificationHandler);

module.exports = router;
