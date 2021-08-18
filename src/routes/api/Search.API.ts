import express from "express";
import { query } from "../../controllers/api/Search.API.controller";

const router = express.Router();

// For searching
router.get("/", query);

export default router;
