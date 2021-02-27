const router = require("express").Router();
const CrawlerController = require("../controllers/api/Crawler.API.controller");

router.get("/meta", CrawlerController.getMeta);

module.exports = router;
