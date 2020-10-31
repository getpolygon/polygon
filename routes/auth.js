const router = require("express").Router();

// Controllers
const RegistrationController = require("../controllers/Registration.Controller");
const LoginController = require("../controllers/Login.Controller");

// Register
router.use("/register", RegistrationController);
// Login
router.use("/login", LoginController);

module.exports = router;