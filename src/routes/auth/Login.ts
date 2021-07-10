import Express from "express";
const router = Express.Router();
import LoginController from "../../controllers/auth/Login.controller";

router.post("/", LoginController);

export default router;
