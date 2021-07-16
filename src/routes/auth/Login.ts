import Express from "express";
const router = Express.Router();
import LoginController from "../../controllers/auth/Login.controller";
import { loginValidationRules, validate } from "../../utils/validation";

router.post("/", loginValidationRules(), validate(), LoginController);

export default router;
