import express from "express";
const router = express.Router();
import ApiRoutes from "./api/index";
import AuthRoutes from "./auth/index";
import NotFoundRoute from "./misc/404";
import authenticate from "../middleware/authenticate";

// Auth
router.use("/auth", AuthRoutes);
// API
router.use("/api", authenticate(), ApiRoutes);
// 404
router.use(NotFoundRoute);

export default router;
