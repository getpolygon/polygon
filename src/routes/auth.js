const router = require("express").Router();

// Controllers
const LoginHandler = require("../auth/Login");
const LogoutHandler = require("../auth/Logout");
const RegistrationHandler = require("../auth/Register");
const VerificationHandler = require("../auth/Verify");

router.use("/login", LoginHandler);
router.use("/logout", LogoutHandler);
router.use("/verify", VerificationHandler);
router.use("/register", RegistrationHandler);

module.exports = router;
