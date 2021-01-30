const router = require("express").Router();

router.all("*", (req, res) => {
  res.status(404).json({
    error: "Something's not right",
    requestPath: req.originalUrl
  });
});

module.exports = router;
