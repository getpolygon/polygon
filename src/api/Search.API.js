const router = require("express").Router();
const SearchController = require("../controllers/api/Search.API.controller");

// For searching
router.get("/", SearchController.query);

module.exports = router;
