import express from "express";
import { login } from "controllers/auth";
import validate from "validation/middleware";
import loginValidationRules from "validation/rules/loginValidationRules";

const router = express.Router();

router.post("/", loginValidationRules(), validate(), login);

export default router;
