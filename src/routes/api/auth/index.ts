import login from "./Login";
import express from "express";
import register from "./Register";
import { logout } from "../../../controllers/auth";

const router = express.Router();

router.use("/login", login);
router.post("/logout", logout);
router.use("/register", register);

export default router;
