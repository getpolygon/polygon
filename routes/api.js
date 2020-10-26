require("mongoose");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("API Endpoint");
});

module.exports = router;
