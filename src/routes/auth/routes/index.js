const router = require("express").Router();

const ResetHandler = require("../Reset");
const LoginHandler = require("../Login");
const LogoutHandler = require("../Logout");
const RegistrationHandler = require("../Register");

router.use("/login", LoginHandler);
router.use("/reset", ResetHandler);
router.use("/logout", LogoutHandler);
router.use("/register", RegistrationHandler);

module.exports = router;
