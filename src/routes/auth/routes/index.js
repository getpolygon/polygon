const router = require("express").Router();

const LoginHandler = require("../Login");
const LogoutHandler = require("../Logout");
const RegistrationHandler = require("../Register");
const authenticate = require("../../../middleware/authenticate").default;

router.use("/logout", LogoutHandler);
router.use("/login", authenticate(true), LoginHandler);
router.use("/register", authenticate(true), RegistrationHandler);

module.exports = router;
