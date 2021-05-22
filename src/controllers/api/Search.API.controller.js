const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/all/account");

const { JWT_PRIVATE_KEY } = process.env;

exports.query = (req, res) => {
  const { query } = req.query;
  const { jwt: token } = req.cookies;

  if (!query) return res.status(400).send("Bad Request");
  else {
    // TODO
    const results = [];
    return res.json(results);
  }
};
