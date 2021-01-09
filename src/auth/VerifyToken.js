const jwt = require("jsonwebtoken"),
  router = require("express").Router();

router.get("/", (req, res) => {
  const { token } = req.query,
    { JWT_TOKEN } = process.env;

  jwt.verify(token, JWT_TOKEN, (err, data) => {
    if (err) {
      return res
        .json({
          error: "Forbidden"
        })
        .status(403);
    }
    if (data) {
      return res.json(data);
    }
  });
});

module.exports = router;
