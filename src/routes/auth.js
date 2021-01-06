const router = require("express").Router();

// Controllers
const RegistrationController = require("../controllers/Registration.Controller");
const LoginController = require("../controllers/Login.Controller");
const VerifyRoute = require("../auth/verify");

router.use("/register", RegistrationController);
router.use("/login", LoginController);
router.use("/verify", VerifyRoute);

module.exports = router;
