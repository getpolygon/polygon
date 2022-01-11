import api from "./api";
import express from "express";

const router = express.Router();

router.use("/api", api);
router.all("*", (_, res) => res.sendStatus(404));

export default router;
