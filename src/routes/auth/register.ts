import express from "express";
import { isEqual } from "lodash";
import config from "config/index";
import { body } from "express-validator";
import validate from "validation/middleware";
import { verify, register } from "controllers/auth";
import validateEmail from "validation/functions/validateEmail";
import validateUsername from "validation/functions/validateUsername";

const router = express.Router();

const registrationRules = [
  body("password").isLength({ min: 8 }),
  body("lastName").trim().escape().notEmpty(),
  body("firstName").trim().escape().notEmpty(),
  body("username").toLowerCase().custom(validateUsername),
  body("email").normalizeEmail().toLowerCase().custom(validateEmail),
];
// Main registration endpoint
router.post("/", registrationRules, validate(), register);

// Only enabling the verification route if it is specified in the configuration
if (isEqual(config.polygon?.emailEnableVerification, true)) {
  const verificationRules = [body("password").isLength({ min: 8 })];
  router.post("/verify/:token", verificationRules, validate(), verify);
}

export default router;
