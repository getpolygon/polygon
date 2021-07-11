import Express from "express";
const router = Express.Router();
import upload from "../../middleware/multer";
import { registrationValidationRules, validate } from "../../utils/validation";
import RegistrationController from "../../controllers/auth/Registration.controller";

router.post(
  "/",
  upload.single("avatar"),
  registrationValidationRules(),
  validate(),
  RegistrationController
);

export default router;
