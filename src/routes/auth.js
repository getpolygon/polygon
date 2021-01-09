const router = require("express").Router();

// Controllers
const LoginHandler = require("../auth/Login");
const RegistrationHandler = require("../auth/Register");
const TokenVerificationHandler = require("../auth/VerifyToken");

router.get("/*", (_req, res) => res.send());
router.use("/login", LoginHandler);
router.use("/register", RegistrationHandler);
router.use("/verify", TokenVerificationHandler);

module.exports = router;
