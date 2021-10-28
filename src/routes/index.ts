import api from "./api";
import auth from "./auth";
import express from "express";

const router = express.Router();

router.use("/api", api);
router.use("/auth", auth);

router.all("*", (_, res) => res.sendStatus(404));

export default router;
