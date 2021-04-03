const router = require("express").Router();
const VerificationController = require("../controllers/auth/Verification.controller");

// For token/account verification
router.get("/", VerificationController.verify);

module.exports = router;
