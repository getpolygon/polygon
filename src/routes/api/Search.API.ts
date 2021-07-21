import express from "express";
const router = express.Router();
import { query } from "../../controllers/api/Search.API.controller";

// For searching
router.get("/", query);

export default router;
