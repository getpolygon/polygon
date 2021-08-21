import express from "express";
const router = express.Router();
import validate from "../../validation";
import { loginValidationRules } from "../../validation/rules";
import LoginController from "../../controllers/auth/Login.controller";

router.post("/", loginValidationRules(), validate(), LoginController);

export default router;
