import express from "express";
const router = express.Router();
import LogoutController from "../../controllers/auth/Logout.controller";

router.post("/", LogoutController);

export default router;
