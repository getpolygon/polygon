import Express from "express";
const router = Express.Router();
// import upload from "../../middleware/multer";
import {
  verify,
  register,
} from "../../controllers/auth/Registration.controller";
import {
  validate,
  registrationValidationRules,
  verificationValidationRules,
} from "../../utils/validation";

router.post("/", registrationValidationRules(), validate(), register);
router.post("/verify/:sid", verificationValidationRules(), validate(), verify);

export default router;
