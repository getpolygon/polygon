const router = require("express").Router();
const LoginHandler = require("../Login");
const LogoutHandler = require("../Logout");
const VerificationHandler = require("../Verify");
const RegistrationHandler = require("../Register");

router.use("/login", LoginHandler);
router.use("/logout", LogoutHandler);
router.use("/verify", VerificationHandler);
router.use("/register", RegistrationHandler);

module.exports = router;
