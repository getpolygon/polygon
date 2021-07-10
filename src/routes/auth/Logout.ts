import Express from "express";
const router = Express.Router();
import LogoutController from "../../controllers/auth/Logout.controller";

router.post("/", LogoutController);

export default router;
