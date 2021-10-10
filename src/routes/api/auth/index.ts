import login from "./login";
import express from "express";
import register from "./register";
import { logout } from "../../../controllers/auth";

const router = express.Router();

router.use("/login", login);
router.post("/logout", logout);
router.use("/register", register);

export default router;
