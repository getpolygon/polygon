import express from "express";
import validate from "../../../validation/middleware";
import { verify, register } from "../../../controllers/auth";
import registrationValidationRules from "../../../validation/rules/registrationValidationRules";
import verificationValidationRules from "../../../validation/rules/verificationValidationRules";

const router = express.Router();

router.post("/", registrationValidationRules(), validate(), register);
router.post("/verify/:sid", verificationValidationRules(), validate(), verify);

export default router;
