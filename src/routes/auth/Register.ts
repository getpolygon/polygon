import Express from "express";
const router = Express.Router();
import upload from "../../middleware/multer";
import RegistrationController from "../../controllers/auth/Registration.controller";

router.post("/", upload.single("avatar"), RegistrationController);

export default router;
