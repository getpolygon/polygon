import Express from "express";
const router = Express.Router();
import NotFoundRoute from "./misc/404";
import APIRoutes from "./api/routes/index";
import AuthRoutes from "./auth/routes/index";
import authenticate from "../middleware/authenticate";

// Auth
router.use("/auth", AuthRoutes);
// API
router.use("/api", authenticate(), APIRoutes);
// 404
router.use(NotFoundRoute);

export default router;
