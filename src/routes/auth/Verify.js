const router = require("express").Router();
const VerificationController = require("../../controllers/auth/Verification.controller");

router.get("/", VerificationController.verify);

module.exports = router;
