const router = require("express").Router();
const SearchController = require("../controllers/api/Search.API.controller");

router.get("/", SearchController.query);

module.exports = router;
