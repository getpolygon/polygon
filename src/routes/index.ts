import api from "./api";
import auth from "./auth";
import express from "express";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.use("/auth", auth);
router.use("/api", authenticate(), api);
router.all("*", (_, res) => res.sendStatus(404));

export default router;
