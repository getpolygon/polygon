import express from "express";
const router = express.Router();
import validate from "../../validation";
import {
  registrationValidationRules,
  verificationValidationRules,
} from "../../validation/rules";
import {
  verify,
  register,
} from "../../controllers/auth/Registration.controller";

router.post("/", registrationValidationRules(), validate(), register);
router.post("/verify/:sid", verificationValidationRules(), validate(), verify);

export default router;
