import express from "express";
import LoginHandler from "./Login";
import LogoutHandler from "./Logout";
import RegistrationHandler from "./Register";
import AuthController from "../../../controllers/auth/Auth.controller";

const router = express.Router();

router.get("/", AuthController);
router.use("/login", LoginHandler);
router.use("/logout", LogoutHandler);
router.use("/register", RegistrationHandler);

export default router;
