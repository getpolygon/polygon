const jwt = require("jsonwebtoken"),
  router = require("express").Router();

router.get("/", (req, res) => {
  const token = req.cookies.jwt,
    { JWT_TOKEN } = process.env;

  if (!token) {
    return res.status(200).json({
      error: "No token"
    });
  } else {
    jwt.verify(token, JWT_TOKEN, (err, data) => {
      if (err) {
        return res
          .json({
            error: "Forbidden"
          })
          .status(403);
      } else if (data) {
        return res.status(200).json(data);
      }
    });
  }
});

module.exports = router;
