import express from "express";
import validate from "../../validation/middleware";
import { verify, register } from "../../controllers/auth";
import registrationRules from "../../validation/rules/registrationValidationRules";
import verificationRules from "../../validation/rules/verificationValidationRules";

const router = express.Router();

router.post("/", registrationRules(), validate(), register);
router.post("/verify/:token", verificationRules(), validate(), verify);

export default router;
