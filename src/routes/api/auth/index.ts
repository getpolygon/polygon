import login from "./login";
import logout from "./logout";
import express from "express";
import register from "./register";

const router = express.Router();

router.use("/login", login);
router.use("/logout", logout);
router.use("/register", register);

export default router;
