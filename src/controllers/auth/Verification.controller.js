const jwt = require("jsonwebtoken");
const AccountSchema = require("../../models/account");

exports.verify = (req, res) => {
  const { JWT_TOKEN } = process.env;
  const { jwt: token } = req.cookies;

  if (!token) {
    return res.status(200).json({
      error: "No token"
    });
  } else {
    jwt.verify(token, JWT_TOKEN, async (err, data) => {
      if (err) {
        return res
          .json({
            error: "Forbidden"
          })
          .status(403);
      } else if (data) {
        const User = await AccountSchema.findById(data.id);
        if (User) {
          return res.status(200).json(data);
        } else {
          return res.status(200).clearCookie("jwt").json({
            error: false
          });
        }
      }
    });
  }
};
