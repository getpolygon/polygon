const router = require("express").Router();
const LogoutController = require("../../controllers/auth/Logout.controller");

router.post("/", LogoutController);

module.exports = router;
