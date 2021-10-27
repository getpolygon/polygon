import login from "./login";
import express from "express";
import register from "./register";
import { logout } from "../../controllers/auth";
import forbidAuthenticated from "../../middleware/forbidAuthenticated";

const router = express.Router();

router.post("/logout", logout);
router.use("/login", forbidAuthenticated(), login);
router.use("/register", forbidAuthenticated(), register);

export default router;
