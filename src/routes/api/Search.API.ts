import express from "express";
const router = express.Router();
import SearchController from "../../controllers/api/Search.API.controller";

// For searching
router.get("/", SearchController.query);

module.exports = router;
