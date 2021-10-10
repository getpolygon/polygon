import express from "express";
const router = express.Router();
import validate from "../../../validation/middleware";
import LoginController from "../../../controllers/auth/Login.controller";
import loginValidationRules from "../../../validation/rules/loginValidationRules";

router.post("/", loginValidationRules(), validate(), LoginController);

export default router;
