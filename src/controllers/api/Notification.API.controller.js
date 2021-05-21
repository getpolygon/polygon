const { JWT_PRIVATE_KEY } = process.env;
const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/all/account");

exports.getAllNotifications = (req, res) => {
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // TODO
    } else {
      // TODO
    }
  });
};
