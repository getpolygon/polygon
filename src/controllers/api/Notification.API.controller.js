const { JWT_PRIVATE_KEY } = process.env;
const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/all/account");

export const getAllNotifications = (req, res) => {
  const { jwt: token } = req.cookies;

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      // TODO
    } else {
      // TODO
    }
  });
};
