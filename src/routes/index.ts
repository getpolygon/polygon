import express from "express";
import ApiRoutes from "./api/index";
import NotFoundRoute from "./misc/404";

const router = express.Router();

router.use("/api", ApiRoutes);
// 404
router.use(NotFoundRoute);

export default router;
