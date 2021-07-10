import Express from "express";
const router = Express.Router();
import upload from "../../middleware/multer";
import RegistrationController from "../../controllers/auth/Registration.controller";

router.post(
  "/",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  RegistrationController
);

export default router;
