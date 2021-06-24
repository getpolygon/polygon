const router = require("express").Router();
const ResetController = require("../../controllers/auth/Reset.controller");

router.post("/", ResetController.resetPassword);
// router.post("/validate", ResetController.validate);

module.exports = router;
