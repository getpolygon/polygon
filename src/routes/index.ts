import express from "express";
import api from "./api/index";

const router = express.Router();

router.use("/api", api);
router.all("*", (_, res) => res.status(404).send("Not Found"));

export default router;
