const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  const token = req.query.token;
  const legit = jwt.verify(token, process.env.JWT_TOKEN);
  res.json({
    isLegit: true,
    ...legit
  });
});

module.exports = router;
