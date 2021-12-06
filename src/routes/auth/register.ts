import express from "express";
import config from "config/index";
import validate from "validation/middleware";
import { verify, register } from "controllers/auth";
import registrationRules from "validation/rules/registrationValidationRules";
import verificationRules from "validation/rules/verificationValidationRules";

const router = express.Router();

router.post("/", registrationRules(), validate(), register);
// Only enabling the verification route if it is specified in the configuration
if (config.polygon?.emailEnableVerification)
  router.post("/verify/:token", verificationRules(), validate(), verify);

export default router;
